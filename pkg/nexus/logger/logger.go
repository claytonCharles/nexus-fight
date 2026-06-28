package logger

import (
	"fmt"
	"log"
	"os"
	"sync"
	"time"
)

type Logger struct {
	mu    sync.Mutex
	file  *os.File
	log   *log.Logger
	month string
	dir   string
}

func NewLogger(pathDir string) (*Logger, error) {
	l := &Logger{
		dir: pathDir,
	}

	if err := l.rotate(); err != nil {
		return nil, err
	}

	return l, nil
}

func (l *Logger) rotate() error {
	currentMonth := time.Now().Format("2006-01")
	if l.month == currentMonth {
		return nil
	}

	if l.file != nil {
		l.file.Close()
	}

	os.MkdirAll(l.dir, 0755)
	file, err := os.OpenFile(fmt.Sprintf("%s/%s.log", l.dir, currentMonth), os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		return err
	}

	l.file = file
	l.log = log.New(file, "", log.Flags())
	l.month = currentMonth
	return nil
}

func (l *Logger) Info(message string) {
	l.mu.Lock()
	defer l.mu.Unlock()

	_ = l.rotate()
	l.log.Println("INFO -", message)
}

func (l *Logger) Warn(message string) {
	l.mu.Lock()
	defer l.mu.Unlock()

	_ = l.rotate()
	l.log.Println("WARN -", message)
}

func (l *Logger) Error(message string, v ...any) {
	l.mu.Lock()
	defer l.mu.Unlock()

	_ = l.rotate()
	l.log.Println("ERROR -", message, fmt.Sprint(v...))
}
