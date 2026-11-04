CREATE TABLE "team" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"role" varchar(255),
	"bio" text,
	"description" text,
	"image_url" text
);
