"use client";

import * as React from "react";
import { Field, inputClass } from "@/components/admin/kit/field";
import { cn } from "@/lib/utils";
import type { HomeSectionId, HomeSections } from "@/lib/site/schema";
import {
  CardListField,
  FormGroup,
  HighlightField,
  ImageField,
  LinkField,
  NumberField,
  PeopleField,
  StringListField,
  TextField,
  ToggleField,
} from "./form-kit";

type Setter = (path: (string | number)[], value: unknown) => void;
type FormProps<K extends HomeSectionId> = { value: HomeSections[K]; set: Setter; errors: Record<string, string> };

function HeroForm({ value, set, errors }: FormProps<"hero">) {
  return (
    <>
      <FormGroup title="Headline">
        <TextField id="badge" label="Small badge above the headline" value={value.badge} onChange={(v) => set(["badge"], v)} error={errors.badge} max={60} />
        <HighlightField id="title" label="Main headline" value={value.title} onChange={(v) => set(["title"], v)} errors={errors} max={300} multiline />
        <HighlightField id="subtitle" label="Text under the headline" value={value.subtitle} onChange={(v) => set(["subtitle"], v)} errors={errors} max={300} multiline />
      </FormGroup>
      <FormGroup title="Button">
        <TextField id="cta-label" label="Button text" value={value.cta.label} onChange={(v) => set(["cta", "label"], v)} error={errors["cta.label"]} max={60} />
        <LinkField id="cta-href" label="Button link" value={value.cta.href} onChange={(v) => set(["cta", "href"], v)} error={errors["cta.href"]} />
      </FormGroup>
      <FormGroup title="Trust line" description="Small client photos with a line of text next to the button.">
        <PeopleField
          id="people"
          label="Client photos"
          hint="Up to 5 round photos. Visitors see the name and role when they point at a photo."
          people={value.people}
          onChange={(v) => set(["people"], v)}
          errors={errors}
          max={5}
        />
        <HighlightField id="trustText" label="Text next to the photos" value={value.trustText} onChange={(v) => set(["trustText"], v)} errors={errors} max={120} multiline />
      </FormGroup>
    </>
  );
}

function MetricsForm({ value, set, errors }: FormProps<"metrics">) {
  return (
    <FormGroup title="Numbers" description="Each number counts up when visitors scroll to it.">
      <CardListField
        id="items"
        label="Counters"
        items={value.items}
        onChange={(v) => set(["items"], v)}
        errors={errors}
        min={1}
        max={4}
        itemName="Number"
        newItem={() => ({ value: 10, prefix: "", suffix: "+", label: "" })}
        itemTitle={(m) => `${m.prefix}${Number.isFinite(m.value) ? m.value : ""}${m.suffix} ${m.label}`}
        renderItem={(m, update, i) => (
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr]">
            <NumberField id={`m-${i}-value`} label="Number" value={m.value} onChange={(v) => update(["value"], v)} error={errors[`items.${i}.value`]} min={0} />
            <TextField id={`m-${i}-prefix`} label="Before it" optional value={m.prefix} onChange={(v) => update(["prefix"], v)} error={errors[`items.${i}.prefix`]} placeholder="$" />
            <TextField id={`m-${i}-suffix`} label="After it" optional value={m.suffix} onChange={(v) => update(["suffix"], v)} error={errors[`items.${i}.suffix`]} placeholder="+" />
            <div className="sm:col-span-3">
              <TextField id={`m-${i}-label`} label="Label" value={m.label} onChange={(v) => update(["label"], v)} error={errors[`items.${i}.label`]} max={40} />
            </div>
          </div>
        )}
      />
    </FormGroup>
  );
}

function AboutForm({ value, set, errors }: FormProps<"about">) {
  return (
    <>
      <FormGroup title="Badge">
        <PeopleField id="people" label="Client photos" hint="Up to 5 small photos inside the badge." people={value.people} onChange={(v) => set(["people"], v)} errors={errors} max={5} />
        <TextField id="badge" label="Badge text" value={value.badge} onChange={(v) => set(["badge"], v)} error={errors.badge} max={80} rows={2} hint="Press Enter to start a new line." />
      </FormGroup>
      <FormGroup title="Text">
        <HighlightField id="title" label="Heading" value={value.title} onChange={(v) => set(["title"], v)} errors={errors} multiline />
        <TextField id="description" label="Description" value={value.description} onChange={(v) => set(["description"], v)} error={errors.description} max={600} rows={4} />
        <StringListField id="points" label="Key points" hint="Short phrases with an orange dot, under the description." items={value.points} onChange={(v) => set(["points"], v)} errors={errors} max={6} itemName="Point" />
      </FormGroup>
    </>
  );
}

function ServicesForm({ value, set, errors }: FormProps<"services">) {
  return (
    <>
      <FormGroup title="Heading">
        <HighlightField id="title" label="Heading" value={value.title} onChange={(v) => set(["title"], v)} errors={errors} multiline />
      </FormGroup>
      <FormGroup title="Service cards">
        <CardListField
          id="cards"
          label="Cards"
          items={value.cards}
          onChange={(cards) => {
            set(["cards"], cards);
            if (value.featuredCard >= cards.length) set(["featuredCard"], -1);
          }}
          errors={errors}
          min={1}
          max={6}
          itemName="Service"
          newItem={() => ({ title: "", description: "", features: [] })}
          itemTitle={(c) => c.title}
          renderItem={(c, update, i) => (
            <>
              <TextField id={`c-${i}-title`} label="Title" value={c.title} onChange={(v) => update(["title"], v)} error={errors[`cards.${i}.title`]} max={60} />
              <TextField id={`c-${i}-description`} label="Description" value={c.description} onChange={(v) => update(["description"], v)} error={errors[`cards.${i}.description`]} max={240} rows={3} />
              <StringListField
                id={`cards.${i}.features`}
                label="What's included"
                items={c.features}
                onChange={(v) => update(["features"], v)}
                errors={errors}
                max={6}
                itemName="Item"
              />
            </>
          )}
        />
        <Field id="featured-card" label="Card shown in white" hint="This card always shows in its white style to draw the eye.">
          <select
            id="featured-card"
            value={value.featuredCard}
            onChange={(e) => set(["featuredCard"], Number(e.target.value))}
            className={cn(inputClass, "h-11")}
          >
            <option value={-1}>None</option>
            {value.cards.map((c, i) => (
              <option key={i} value={i}>
                {i + 1}. {c.title || "Untitled"}
              </option>
            ))}
          </select>
        </Field>
      </FormGroup>
      <FormGroup title="Under the cards">
        <TextField id="outro" label="Text above the button" optional value={value.outro} onChange={(v) => set(["outro"], v)} error={errors.outro} max={120} />
        <TextField id="cta-label" label="Button text" value={value.cta.label} onChange={(v) => set(["cta", "label"], v)} error={errors["cta.label"]} max={60} />
        <LinkField id="cta-href" label="Button link" value={value.cta.href} onChange={(v) => set(["cta", "href"], v)} error={errors["cta.href"]} />
      </FormGroup>
    </>
  );
}

function FrameworkForm({ value, set, errors }: FormProps<"framework">) {
  return (
    <>
      <FormGroup title="Heading">
        <HighlightField id="title" label="Heading" value={value.title} onChange={(v) => set(["title"], v)} errors={errors} />
        <TextField id="description" label="Description" value={value.description} onChange={(v) => set(["description"], v)} error={errors.description} max={300} rows={3} />
      </FormGroup>
      <FormGroup title="Phases" description="Up to 4 columns. Steps are numbered automatically across all phases.">
        <CardListField
          id="phases"
          label="Phases"
          items={value.phases}
          onChange={(v) => set(["phases"], v)}
          errors={errors}
          min={1}
          max={4}
          itemName="Phase"
          newItem={() => ({ title: "", steps: [""] })}
          itemTitle={(p) => p.title}
          renderItem={(p, update, i) => (
            <>
              <TextField id={`p-${i}-title`} label="Phase name" value={p.title} onChange={(v) => update(["title"], v)} error={errors[`phases.${i}.title`]} max={40} />
              <StringListField id={`phases.${i}.steps`} label="Steps" items={p.steps} onChange={(v) => update(["steps"], v)} errors={errors} min={1} max={8} itemName="Step" />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function FeaturedForm({ value, set, errors }: FormProps<"featured">) {
  return (
    <>
      <FormGroup title="Heading" description="The projects themselves come from Projects: switch on “Show on Home page” for the ones you want here.">
        <HighlightField id="title" label="Heading" value={value.title} onChange={(v) => set(["title"], v)} errors={errors} multiline />
        <TextField id="description" label="Description" value={value.description} onChange={(v) => set(["description"], v)} error={errors.description} max={300} rows={3} />
        <NumberField id="count" label="How many projects to show" value={value.count} onChange={(v) => set(["count"], v)} error={errors.count} min={1} max={8} step={1} />
      </FormGroup>
      <FormGroup title="Invitation card" description="The last card in the list, inviting visitors to work with you.">
        <ToggleField id="cta-show" label="Show the invitation card" checked={value.ctaCard.show} onChange={(v) => set(["ctaCard", "show"], v)} />
        <TextField id="cta-title" label="Card title" value={value.ctaCard.title} onChange={(v) => set(["ctaCard", "title"], v)} error={errors["ctaCard.title"]} max={60} />
        <TextField id="cta-description" label="Card text" value={value.ctaCard.description} onChange={(v) => set(["ctaCard", "description"], v)} error={errors["ctaCard.description"]} max={120} />
      </FormGroup>
    </>
  );
}

function TestimonialsForm({ value, set, errors }: FormProps<"testimonials">) {
  return (
    <>
      <FormGroup title="Heading" description="The reviews themselves come from Testimonials.">
        <TextField id="label" label="Small label" value={value.label} onChange={(v) => set(["label"], v)} error={errors.label} max={30} />
        <TextField id="title" label="Heading" value={value.title} onChange={(v) => set(["title"], v)} error={errors.title} max={80} />
        <TextField id="subtitle" label="Line under the heading" optional value={value.subtitle} onChange={(v) => set(["subtitle"], v)} error={errors.subtitle} max={120} />
        <NumberField id="count" label="How many reviews to show" value={value.count} onChange={(v) => set(["count"], v)} error={errors.count} min={1} max={12} step={1} />
      </FormGroup>
      <FormGroup title="Rating line" description="The small box with a star under the reviews.">
        <ToggleField id="rating-show" label="Show the rating line" checked={value.rating.show} onChange={(v) => set(["rating", "show"], v)} />
        <TextField id="rating-title" label="Rating text" value={value.rating.title} onChange={(v) => set(["rating", "title"], v)} error={errors["rating.title"]} max={60} />
        <TextField id="rating-subtitle" label="Second line" optional value={value.rating.subtitle} onChange={(v) => set(["rating", "subtitle"], v)} error={errors["rating.subtitle"]} max={60} />
      </FormGroup>
    </>
  );
}

function BlogForm({ value, set, errors }: FormProps<"blog">) {
  return (
    <FormGroup title="Heading" description="Shows your three newest articles. The section stays hidden until one is published.">
      <HighlightField id="title" label="Heading" value={value.title} onChange={(v) => set(["title"], v)} errors={errors} />
      <TextField id="description" label="Description" optional value={value.description} onChange={(v) => set(["description"], v)} error={errors.description} max={200} />
      <TextField id="buttonLabel" label="Button text" value={value.buttonLabel} onChange={(v) => set(["buttonLabel"], v)} error={errors.buttonLabel} max={40} />
    </FormGroup>
  );
}

function FaqForm({ value, set, errors }: FormProps<"faq">) {
  return (
    <>
      <FormGroup title="Heading">
        <TextField id="title" label="Heading" value={value.title} onChange={(v) => set(["title"], v)} error={errors.title} max={100} />
        <TextField id="description" label="Description" optional value={value.description} onChange={(v) => set(["description"], v)} error={errors.description} max={240} rows={2} />
      </FormGroup>
      <FormGroup title="Questions">
        <CardListField
          id="items"
          label="Questions and answers"
          items={value.items}
          onChange={(v) => set(["items"], v)}
          errors={errors}
          min={1}
          max={20}
          itemName="Question"
          newItem={() => ({ question: "", answer: "" })}
          itemTitle={(q) => q.question}
          renderItem={(q, update, i) => (
            <>
              <TextField id={`q-${i}-question`} label="Question" value={q.question} onChange={(v) => update(["question"], v)} error={errors[`items.${i}.question`]} max={160} />
              <TextField id={`q-${i}-answer`} label="Answer" value={q.answer} onChange={(v) => update(["answer"], v)} error={errors[`items.${i}.answer`]} max={1200} rows={4} />
            </>
          )}
        />
      </FormGroup>
    </>
  );
}

function CtaForm({ value, set, errors }: FormProps<"cta">) {
  return (
    <FormGroup title="Banner">
      <TextField id="title" label="Banner text" value={value.title} onChange={(v) => set(["title"], v)} error={errors.title} max={60} hint="Keep it short: it shows in very large letters." />
      <LinkField id="href" label="Link when clicked" optional value={value.href} onChange={(v) => set(["href"], v)} error={errors.href} />
    </FormGroup>
  );
}

function ContactForm({ value, set, errors }: FormProps<"contact">) {
  return (
    <>
      <FormGroup title="Heading">
        <TextField id="title" label="Heading" value={value.title} onChange={(v) => set(["title"], v)} error={errors.title} max={100} />
        <TextField id="description" label="Description" optional value={value.description} onChange={(v) => set(["description"], v)} error={errors.description} max={300} rows={3} />
      </FormGroup>
      <FormGroup title="Form">
        <StringListField
          id="services"
          label="Services visitors can choose"
          hint="The choices in the “Select a service” list. New leads show the service they picked."
          items={value.services}
          onChange={(v) => set(["services"], v)}
          errors={errors}
          min={1}
          max={12}
          itemName="Service"
        />
        <TextField id="submitLabel" label="Send button text" value={value.submitLabel} onChange={(v) => set(["submitLabel"], v)} error={errors.submitLabel} max={50} />
      </FormGroup>
      <FormGroup title="Picture" description="Shown next to the form on larger screens.">
        <ImageField id="image" label="Picture" optional value={value.image} onChange={(v) => set(["image"], v)} error={errors.image} aspect="aspect-[4/3]" />
        <TextField id="imageAlt" label="Describe the picture" optional value={value.imageAlt} onChange={(v) => set(["imageAlt"], v)} error={errors.imageAlt} max={160} hint="Helps screen readers and Google." />
      </FormGroup>
    </>
  );
}

export const HOME_SECTION_FORMS: { [K in HomeSectionId]: (props: FormProps<K>) => React.ReactNode } = {
  hero: HeroForm,
  metrics: MetricsForm,
  about: AboutForm,
  services: ServicesForm,
  framework: FrameworkForm,
  featured: FeaturedForm,
  testimonials: TestimonialsForm,
  blog: BlogForm,
  faq: FaqForm,
  cta: CtaForm,
  contact: ContactForm,
};
