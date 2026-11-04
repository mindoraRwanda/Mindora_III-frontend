CREATE TYPE "public"."contact_message_source" AS ENUM('contact', 'demo');--> statement-breakpoint
CREATE TABLE "contact_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"organization" varchar(255),
	"message" text,
	"source" "contact_message_source" DEFAULT 'contact' NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
