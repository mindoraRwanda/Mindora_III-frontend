"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LinkedinIcon,
  TwitterIcon,
  MailIcon,
  ChevronUpIcon,
  Phone,
  ArrowRightIcon,
} from "lucide-react";
import { getTeamMembers } from "./action";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  extendedBio?: string;
  expertise?: string[];
  linkedin?: string;
  twitter?: string;
  email?: string;
  phone?: string;
}

const predefinedRoleOrder = [
  "Co-founder & CEO",
  "Co-founder & SEO",
  "Co-founder & CTO",
  "Co-founder & CPO",
  "COO of MINDORA",
  "MRO",
  "DIO",
  "PPO",
  "Content Creator",
  "UX",
  "Marketing Director",
];

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const toggleExpanded = (name: string) => {
    setExpandedMember(expandedMember === name ? null : name);
  };

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const members = await getTeamMembers();
        const formattedMembers = members.map((member) => ({
          name: member.name || "Unknown",
          role: member.role || "Unknown",
          imageUrl: member.imageUrl || "/default-image.png",
          bio: member.bio || "",
          extendedBio: member.description || "",
        }));

        // Sort team members based on predefined role order
        const sortedMembers = formattedMembers.sort((a, b) => {
          const aIndex = predefinedRoleOrder.indexOf(a.role);
          const bIndex = predefinedRoleOrder.indexOf(b.role);
          
          if (aIndex >= 0 && bIndex >= 0) {
            return aIndex - bIndex;
          }
          
          // If only one role is in the predefined order, it comes first
          if (aIndex >= 0) return -1;
          if (bIndex >= 0) return 1;
          
          // If neither role is in the predefined order, sort alphabetically
          return a.role.localeCompare(b.role);
        });

        setTeamMembers(sortedMembers);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    }

    fetchTeamMembers();
  }, []);

  const memberVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-950 to-indigo-950">
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 inline-block mb-6">
            The Minds Behind Our Mission
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-violet-500 to-cyan-500 mx-auto rounded-full mb-8" />
          <p className="text-stone-300 max-w-2xl mx-auto text-lg">
            Our passionate team combines expertise in psychology, technology, and design 
            to create meaningful mental health support for everyone.
          </p>
        </motion.div>

        {/* Team members grid - all displayed together */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={memberVariants}
              layoutId={`card-${member.name}`}
            >
              <Card
                className={`
                  group relative overflow-hidden border-0 rounded-xl
                  ${
                    expandedMember === member.name
                      ? "bg-gradient-to-b from-slate-800/90 to-indigo-900/90 backdrop-blur-lg shadow-xl shadow-indigo-500/20 scale-105 z-10"
                      : "bg-slate-800/60 backdrop-blur-md hover:bg-slate-800/80 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
                  }
                `}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row gap-5 items-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-violet-600 to-indigo-600 p-1">
                      <div className="absolute inset-0 rounded-full overflow-hidden p-1">
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          sizes="128px"
                          className="object-cover rounded-full"
                          priority
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-30 transition-opacity" />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-sm font-medium text-violet-300 mb-3">{member.role}</p>
                      <p className="text-stone-300 text-sm line-clamp-2 mb-3">
                        {member.bio}
                      </p>
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 w-8 flex justify-center items-center rounded-full bg-slate-700 text-violet-300 hover:bg-violet-600 hover:text-white transition-colors"
                          >
                            <LinkedinIcon className="h-4 w-4" />
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 w-8 flex justify-center items-center rounded-full bg-slate-700 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            <TwitterIcon className="h-4 w-4" />
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="h-8 w-8 flex justify-center items-center rounded-full bg-slate-700 text-cyan-300 hover:bg-cyan-600 hover:text-white transition-colors"
                          >
                            <MailIcon className="h-4 w-4" />
                          </a>
                        )}
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            className="h-8 w-8 flex justify-center items-center rounded-full bg-slate-700 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {member.extendedBio && (
                    <div className="mt-5">
                      <Button
                        variant="ghost"
                        className={`
                          w-full flex items-center justify-center gap-2 text-sm
                          ${
                            expandedMember === member.name
                              ? "text-white bg-indigo-700/30"
                              : "text-indigo-300 hover:text-white hover:bg-indigo-700/20"
                          }
                        `}
                        onClick={() => toggleExpanded(member.name)}
                      >
                        {expandedMember === member.name ? (
                          <>
                            Hide Details <ChevronUpIcon className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Show Details <ArrowRightIcon className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                      
                      {expandedMember === member.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 text-stone-300 text-sm leading-relaxed"
                        >
                          <div className="bg-slate-800/70 rounded-lg p-4 backdrop-blur-sm border border-indigo-900/50">
                            {member.extendedBio}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}