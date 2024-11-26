"use client";
import "react-datepicker/dist/react-datepicker.css";
import { chakra_petch } from "~/app/utils/font";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { cn } from "~/lib/utils";
import useVendorDetailsContext from "../hooks/useVendorDetails";

const Faqs = () => {
  const { vendor } = useVendorDetailsContext();

  return (
    <section>
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-10">
          <h1
            className={cn(
              "mb-4 text-4xl font-semibold",
              chakra_petch.className,
            )}
          >
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="lg:7/12 w-full text-lg text-slate-600 md:w-9/12">
            Have questions? Check out our FAQ section for quick answers to the
            most common inquiries. We&apos;ve got you covered!
          </p>
        </div>

        <div>
          <Accordion type="multiple">
            {(vendor?.faqs ?? []).length > 0 ? (
              vendor?.faqs?.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="py-10">
                <p className="text-center text-lg text-slate-600">
                  No FAQs available
                </p>
              </div>
            )}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
