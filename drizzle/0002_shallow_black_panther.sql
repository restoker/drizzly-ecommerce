CREATE TABLE IF NOT EXISTS "emailToken" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "emailToken_id_token_pk" PRIMARY KEY("id","token")
);
