CREATE TABLE IF NOT EXISTS "twoFactorToken" (
	"id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "twoFactorToken_id_token_pk" PRIMARY KEY("id","token")
);
--> statement-breakpoint
DROP TABLE "toFactorToken";