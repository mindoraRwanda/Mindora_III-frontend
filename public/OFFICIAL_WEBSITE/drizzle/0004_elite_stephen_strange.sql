CREATE TABLE "hall_of_fame" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"role" varchar(255),
	"image" text
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"image" text
);
