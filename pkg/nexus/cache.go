package nexus

import (
	"context"
	"sync"
	"time"
)

type CacheItem struct {
	Value      any
	Expiration int64
}

type CacheMemory struct {
	rwmu  sync.RWMutex
	items map[string]CacheItem
}

func NewCache(ctx context.Context, clearInterval time.Duration) *CacheMemory {
	cm := &CacheMemory{
		items: make(map[string]CacheItem),
	}

	go func() {
		interval := time.NewTicker(clearInterval)
		defer interval.Stop()

		for {
			select {
			case <-interval.C:
				cm.clearExpirations()
			case <-ctx.Done():
				return
			}
		}
	}()

	return cm
}

func (cm *CacheMemory) Get(key string) any {
	now := time.Now().UnixNano()

	cm.rwmu.RLock()
	item, exists := cm.items[key]
	cm.rwmu.RUnlock()

	if !exists {
		return nil
	}

	if cm.checkExpirationTime(now, item.Expiration) {
		cm.rwmu.Lock()
		delete(cm.items, key)
		cm.rwmu.Unlock()
		return nil
	}

	return item.Value
}

func (cm *CacheMemory) Set(key string, value any, expiration time.Duration) {
	expTimer := time.Now().Add(expiration).UnixNano()

	cm.rwmu.Lock()
	defer cm.rwmu.Unlock()

	cm.items[key] = CacheItem{
		Value:      value,
		Expiration: expTimer,
	}
}

func (cm *CacheMemory) Delete(key string) {
	cm.rwmu.Lock()
	defer cm.rwmu.Unlock()

	_, ok := cm.items[key]
	if !ok {
		return
	}

	delete(cm.items, key)
}

func (cm *CacheMemory) clearExpirations() {
	now := time.Now().UnixNano()
	expKeys := cm.getExpiredKeys(now)

	if len(expKeys) == 0 {
		return
	}

	cm.rwmu.Lock()
	defer cm.rwmu.Unlock()

	for _, key := range expKeys {
		item := cm.items[key]
		if cm.checkExpirationTime(now, item.Expiration) {
			delete(cm.items, key)
		}
	}
}

func (cm *CacheMemory) getExpiredKeys(now int64) []string {
	cm.rwmu.RLock()
	defer cm.rwmu.RUnlock()

	expKeys := []string{}
	for key, value := range cm.items {
		if cm.checkExpirationTime(now, value.Expiration) {
			expKeys = append(expKeys, key)
		}
	}

	return expKeys
}

func (cm *CacheMemory) checkExpirationTime(now int64, expiration int64) bool {
	return expiration > 0 && now >= expiration
}
