
"use client";
import Link from "next/link";
import { Youtube, Instagram, Twitter, Twitch, Music, Handshake, Volume2, VolumeX, Volume1 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useRef, useEffect, useState } from 'react';
import { Slider } from "@/components/ui/slider";

// --- Data ---
const profile = {
  name: "Ainzthus",
  avatarUrl: "/icon.png",
  description: "Hago cosas | Streamer | Music lover"
};

type SocialLink = {
  title: string;
  url: string;
  icon: LucideIcon;
};

const mainLinks: SocialLink[] = [
  { title: "Playlist #1", url: "https://www.youtube.com/@ainzthus/playlists", icon: Youtube },
  { title: "Playlist #2", url: "https://soundcloud.com/ainzthus/likes", icon: Music },
  { title: "Donaciones", url: "#", icon: Handshake },
];

const socialLinks: SocialLink[] = [
  { title: "YouTube", url: "https://www.youtube.com/@ainzthus", icon: Youtube },
  { title: "Twitch", url: "https://www.twitch.tv/ainzthus", icon: Twitch },
  { title: "Instagram", url: "https://www.instagram.com/ainzthus/", icon: Instagram },
  { title: "Twitter / X", url: "https://x.com/ainzthus", icon: Twitter },
];

// --- Sub-components ---

const BackgroundMedia = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.25);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);

  const handleInteraction = () => {
    if (hasInteracted) return;
    videoRef.current?.play();
    if (audioRef.current) {
        audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
    setHasInteracted(true);
  };

  useEffect(() => {
    document.body.addEventListener('click', handleInteraction, { once: true });
    document.body.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.body.removeEventListener('click', handleInteraction);
      document.body.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, hasInteracted]);

  const toggleMute = () => {
    if (!hasInteracted) handleInteraction();
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (newVolume: number[]) => {
    const newVol = newVolume[0];
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVol === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <>
      <video
        ref={videoRef}
        src="/background.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />
      <audio
        ref={audioRef}
        src="/background-audio.mp3"
        loop
        playsInline
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10" />
      <div 
        className="absolute top-4 left-4 z-10 flex items-center gap-4 group"
        onMouseEnter={() => setIsVolumeHovered(true)}
        onMouseLeave={() => setIsVolumeHovered(false)}
      >
        <Button onClick={toggleMute} variant="ghost" size="icon" className="text-white bg-black/30 hover:bg-white/20 backdrop-blur-md">
          <VolumeIcon className="h-6 w-6" />
        </Button>
        <div className={`transition-all duration-300 ease-in-out ${isVolumeHovered ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>
          <div className="bg-black/30 backdrop-blur-md rounded-full p-2 border border-white/10">
            <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.01}
              />
          </div>
        </div>
      </div>
    </>
  );
};

const ProfileHeader = () => {
  return (
    <header className="flex flex-col items-center text-center space-y-4">
      <Avatar className="w-28 h-28 border-4 border-background ring-4 ring-primary shadow-lg">
        <AvatarImage src={profile.avatarUrl} alt={profile.name} />
        <AvatarFallback className="text-3xl bg-muted">{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-white">
          Ainzthus
        </h1>
        <p className="text-lg text-gray-300">
          {profile.description}
        </p>
      </div>
    </header>
  );
};

const MainLinksSection = () => (
  <section className="w-full flex flex-col items-center space-y-3 mt-8">
    {mainLinks.map((link) => (
      <Button key={link.title} variant="secondary" size="lg" asChild className="w-full max-w-sm transform transition-transform duration-300 hover:scale-105 shadow-md bg-white/10 hover:bg-white/20 text-white border-none">
        <Link href={link.url} target="_blank" className="flex items-center justify-center text-lg font-semibold">
          <link.icon className="h-5 w-5 mr-3 shrink-0" />
          <span>{link.title}</span>
        </Link>
      </Button>
    ))}
  </section>
);

const SocialLinksSection = () => (
  <section className="flex justify-center items-center gap-x-6 mt-8">
    {socialLinks.map((link) => (
      <Link key={link.title} href={link.url} target="_blank" className="text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-110">
        <link.icon className="h-7 w-7" />
        <span className="sr-only">{link.title}</span>
      </Link>
    ))}
  </section>
);

// --- Main Page Component ---

export default function Home() {

  useEffect(() => {
    const title = "@Ainzthus";
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const typeEffect = () => {
      const currentTitle = title.substring(0, charIndex);
      document.title = currentTitle;

      if (!isDeleting) {
        charIndex++;
      } else {
        charIndex--;
      }
      
      let typeSpeed = isDeleting ? 100 : 200;

      if (!isDeleting && charIndex > title.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause after writing
        charIndex = title.length; // Ensure index is correct for deleting
      } else if (isDeleting && charIndex < 0) {
        charIndex = 0;
        isDeleting = false;
        typeSpeed = 500; // Pause after deleting
      }

      timeoutId = setTimeout(typeEffect, typeSpeed);
    };

    typeEffect();

    return () => {
      clearTimeout(timeoutId);
      document.title = '@Ainzthus'; // Reset title on component unmount
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen font-body text-foreground overflow-hidden">
      <BackgroundMedia />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <main className="w-full max-w-sm mx-auto flex flex-col items-center justify-center bg-black/30 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-lg">
          <ProfileHeader />
          <MainLinksSection />
          <SocialLinksSection />
        </main>
      </div>
    </div>
  );
}
