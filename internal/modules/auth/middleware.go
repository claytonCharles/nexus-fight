package auth

import (
	"github.com/claytonCharles/nexus-fight/pkg/nexus"
)

func AuthMiddleware(cache *nexus.CacheMemory) nexus.Middleware {
	return func(hf nexus.HandlerFunc) nexus.HandlerFunc {
		return func(hc *nexus.HttpContext) {
			sessionToken, err := hc.Request.Cookie("session_token")
			if err != nil {
				hc.ResponseJson("Unauthorized", 403)
				return
			}

			data, ok := cache.Get(sessionToken.Value).(map[string]any)
			if !ok {
				hc.ResponseJson("Unauthorized", 403)
				return
			}

			csrfToken := hc.Request.Header.Get("X-CSRF-Token")
			if csrfToken != data["csrf_token"] {
				hc.ResponseJson("Unauthorized", 403)
				return
			}

			hc.SessionSet("user", data["user"])

			hf(hc)
		}
	}
}
