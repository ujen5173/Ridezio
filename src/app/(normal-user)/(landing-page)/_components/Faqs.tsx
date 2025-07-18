"use client";
import "react-datepicker/dist/react-datepicker.css";
import { chakra_petch } from "~/app/utils/font";
import { constructMetadata } from "~/app/utils/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { cn } from "~/lib/utils";
import { faqs } from "./data/faqs";

export const generateMetadata = () =>
  constructMetadata({
    title: "Frequently Asked Questions | Ridezio",
    description:
      "Answers to common questions about renting vehicles with Ridezio.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I rent a vehicle?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Choose your vehicle, select dates, and book instantly online.",
          },
        },
        // ...more Q&A
      ],
    },
  });

const Faqs = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:py-16">
        <div className="mb-10">
          <h1
            className={cn(
              "mb-4 text-3xl font-semibold text-slate-700 md:text-4xl",
              chakra_petch.className,
            )}
          >
            Frequently Asked Questions (FAQs)
          </h1>
        </div>

        <div>
          <Accordion
            type="multiple"
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="py-2 text-left sm:py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-md sm:text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
