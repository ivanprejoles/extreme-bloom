"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "@/components/ui/card-carousel";

interface AppleProps {
  events: {
    id: string,
    title: string,
    description: string,
    imageSrc: string
  }[]
}

export function AppleCardsCarouselDemo({
  events
}: AppleProps) {

  const data = events.map(event => ({
    category: event.title,
    title: event.description,
    src: event.imageSrc,
    content: <DummyContent event={event} />,
  }));
  
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Stay Updated with the Latest Events and Happenings.
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

interface DummyProps {
  event: {
    id: string,
    title: string,
    description: string,
    imageSrc: string
  }
}

const DummyContent = ({
  event
}: DummyProps) => {
  return (
    <div
      className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
    >
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          {event.title}
        </span>{" "}
        {event.description}
      </p>
      <Image
        src={event.imageSrc ||"/logo.png"}
        alt={event.title}
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
  );
}