package dtos

import "time"

type Session struct {
	SessionToken string
	CSRFToken    string
	Duration     time.Duration
}
