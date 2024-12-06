package config

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/maruf25/miniproject_auth/backend/pkg/db"
)

var CONN *pgx.Conn
var CtxBackground *context.Context
var Queries *db.Queries

func InitDB() {
	dbName := os.Getenv("DB_NAME")
	dbUser := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")

	connString := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=allow", dbUser, dbPassword, dbName)

	ctx := context.Background()

	CtxBackground = &ctx

	conn, err := pgx.Connect(ctx, connString)
	if err != nil {
		panic(err)
	}
	// defer conn.Close(ctx)

	queries := db.New(conn)

	Queries = queries
}
