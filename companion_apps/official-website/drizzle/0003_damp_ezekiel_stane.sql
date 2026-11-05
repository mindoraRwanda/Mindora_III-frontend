CREATE TABLE "success_stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text,
	"author" varchar(255),
	"role" varchar(255),
	"created_at" timestamp DEFAULT now()
);
