"use client";

import * as React from "react";
import { Field, inputClass } from "@/components/admin/kit/field";
import { cn } from "@/lib/utils";
import { saveSeoSettings, saveSiteDoc } from "@/app/actions/site";
import { DEFAULT_DOCS } from "@/lib/site/defaults";
import {
  blogPageSchema,
  careersSchema,
  portfolioPageSchema,
  seoSchema,
  siteSchema,
  SOCIAL_KEYS,
  SOCIAL_NAMES,
  VALUE_ICON_NAMES,
  VALUE_ICONS,
  type BlogPageContent,
  type CareersContent,
  type PortfolioPageContent,
  type SeoSettings,
  type SiteSettings,
  type ValueIcon,
} from "@/lib/site/schema";
import {
  CardListField,
  FormGroup,
  HighlightField,
  ImageField,
  StringListField,
  TextField,
  ToggleField,
} from "./form-kit";
import { InlineForm } from "./inline-form";

export function PortfolioPageEditor({ initial }: { initial: PortfolioPageContent }) {
  return (
    <InlineForm initial={initial} defaults={DEFAULT_DOCS.portfolio} schema={portfolioPageSchema} onSave={(v) => saveSiteDoc("portfolio", v)}>
      {({ value, set, errors }) => (
        <FormGroup title="Page heading" description="The title and line of text above your projects. The projects come from Projects.">
          <HighlightField id="title" label="Heading" value={value.title} onChange={(v) => set(["title"], v)} errors={errors} max={120} />
          <TextField id="description" label="Text beside the heading" optional value={value.description} onChange={(v) => set(["description"], v)} error={errors.description} max={200} rows={2} />
        </FormGroup>
      )}
    </InlineForm>
  );
}

export function BlogPageEditor({ initial }: { initial: BlogPageContent }) {
  return (
    <InlineForm initial={initial} defaults={DEFAULT_DOCS.blogPage} schema={blogPageSchema} onSave={(v) => saveSiteDoc("blogPage", v)}>
      {({ value, set, errors }) => (
        <FormGroup title="Page heading" description="The title above your articles. Articles themselves are written in Blog.">
          <HighlightField id="title" label="Heading" value={value.title} onChange={(v) => set(["title"], v)} errors={errors} max={120} />
          <TextField id="description" label="Text beside the heading" optional value={value.description} onChange={(v) => set(["description"], v)} error={errors.description} max={200} rows={2} />
        </FormGroup>
      )}
    </InlineForm>
  );
}

export function CareersEditor({ initial }: { initial: CareersContent }) {
  return (
    <InlineForm initial={initial} defaults={DEFAULT_DOCS.careers} schema={careersSchema} onSave={(v) => saveSiteDoc("careers", v)}>
      {({ value, set, errors }) => (
        <>
          <FormGroup title="Top of the page">
            <TextField id="hero-badge" label="Small badge" value={value.hero.badge} onChange={(v) => set(["hero", "badge"], v)} error={errors["hero.badge"]} max={60} />
            <HighlightField id="hero.title" label="Headline" value={value.hero.title} onChange={(v) => set(["hero", "title"], v)} errors={errors} multiline />
            <TextField id="hero-description" label="Text under the headline" value={value.hero.description} onChange={(v) => set(["hero", "description"], v)} error={errors["hero.description"]} max={600} rows={4} />
            <TextField id="hero-cta" label="Button text" value={value.hero.ctaLabel} onChange={(v) => set(["hero", "ctaLabel"], v)} error={errors["hero.ctaLabel"]} max={50} hint="The button scrolls down to the application form." />
          </FormGroup>

          <FormGroup title="What you value">
            <ToggleField id="values-show" label="Show this section" checked={value.values.show} onChange={(v) => set(["values", "show"], v)} />
            <TextField id="values-title" label="Heading" value={value.values.title} onChange={(v) => set(["values", "title"], v)} error={errors["values.title"]} max={60} />
            <CardListField
              id="values.items"
              label="Values"
              items={value.values.items}
              onChange={(v) => set(["values", "items"], v)}
              errors={errors}
              min={1}
              max={8}
              itemName="Value"
              newItem={() => ({ title: "", description: "", icon: "sparkles" as ValueIcon })}
              itemTitle={(v) => v.title}
              renderItem={(item, update, i) => (
                <>
                  <TextField id={`v-${i}-title`} label="Value" value={item.title} onChange={(v) => update(["title"], v)} error={errors[`values.items.${i}.title`]} max={60} />
                  <TextField id={`v-${i}-description`} label="Description" value={item.description} onChange={(v) => update(["description"], v)} error={errors[`values.items.${i}.description`]} max={240} rows={2} />
                  <Field id={`v-${i}-icon`} label="Icon">
                    <select id={`v-${i}-icon`} value={item.icon} onChange={(e) => update(["icon"], e.target.value)} className={cn(inputClass, "h-11")}>
                      {VALUE_ICONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {VALUE_ICON_NAMES[icon]}
                        </option>
                      ))}
                    </select>
                  </Field>
                </>
              )}
            />
          </FormGroup>

          <FormGroup title="Application form" description="The form fields stay the same; you can change the words around them.">
            <TextField id="form-title" label="Heading" value={value.form.title} onChange={(v) => set(["form", "title"], v)} error={errors["form.title"]} max={60} />
            <TextField id="form-description" label="Text under the heading" optional value={value.form.description} onChange={(v) => set(["form", "description"], v)} error={errors["form.description"]} max={200} />
            <TextField id="form-privacy" label="Privacy note" optional value={value.form.privacy} onChange={(v) => set(["form", "privacy"], v)} error={errors["form.privacy"]} max={400} rows={3} />
            <TextField id="form-submit" label="Send button text" value={value.form.submitLabel} onChange={(v) => set(["form", "submitLabel"], v)} error={errors["form.submitLabel"]} max={40} />
            <TextField id="form-success-title" label="Thank-you heading" value={value.form.successTitle} onChange={(v) => set(["form", "successTitle"], v)} error={errors["form.successTitle"]} max={60} hint="Shown after someone sends an application." />
            <TextField id="form-success" label="Thank-you message" value={value.form.successMessage} onChange={(v) => set(["form", "successMessage"], v)} error={errors["form.successMessage"]} max={400} rows={3} />
          </FormGroup>
        </>
      )}
    </InlineForm>
  );
}

export function SiteEditor({ initial }: { initial: SiteSettings }) {
  return (
    <InlineForm initial={initial} defaults={DEFAULT_DOCS.site} schema={siteSchema} onSave={(v) => saveSiteDoc("site", v)}>
      {({ value, set, errors }) => (
        <>
          <FormGroup title="Contact details" description="Shown in the footer of every page and given to Google. Leave a field empty to hide it.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id="phone" label="Phone number" optional value={value.phone} onChange={(v) => set(["phone"], v)} error={errors.phone} placeholder="+92 319 0504566" />
              <TextField
                id="whatsapp"
                label="WhatsApp number"
                optional
                value={value.whatsapp}
                onChange={(v) => set(["whatsapp"], v)}
                error={errors.whatsapp}
                placeholder="+923190504566"
                hint="Clicking the phone number opens a WhatsApp chat with this number."
              />
              <TextField id="email" label="Email" optional value={value.email} onChange={(v) => set(["email"], v)} error={errors.email} placeholder="hello@example.com" />
              <TextField id="address" label="Location" optional value={value.address} onChange={(v) => set(["address"], v)} error={errors.address} placeholder="City, Country" />
            </div>
            <TextField id="mapUrl" label="Map link" optional value={value.mapUrl} onChange={(v) => set(["mapUrl"], v)} error={errors.mapUrl} placeholder="https://maps.google.com/…" hint="Opens when visitors click your location. Copy it from Google Maps → Share." />
          </FormGroup>

          <FormGroup title="Social media" description="Paste the full link to each profile. Empty ones don't show.">
            <div className="grid gap-5 sm:grid-cols-2">
              {SOCIAL_KEYS.map((key) => (
                <TextField
                  key={key}
                  id={`social-${key}`}
                  label={SOCIAL_NAMES[key]}
                  optional
                  value={value.socials[key]}
                  onChange={(v) => set(["socials", key], v)}
                  error={errors[`socials.${key}`]}
                  placeholder="https://"
                />
              ))}
            </div>
          </FormGroup>

          <FormGroup title="Footer">
            <TextField id="footerText" label="Text under the logo" value={value.footerText} onChange={(v) => set(["footerText"], v)} error={errors.footerText} max={240} rows={2} />
            <StringListField
              id="footerServices"
              label="Services column"
              hint="Each one links to the Services section of the Home page."
              items={value.footerServices}
              onChange={(v) => set(["footerServices"], v)}
              errors={errors}
              max={8}
              itemName="Service"
            />
          </FormGroup>
        </>
      )}
    </InlineForm>
  );
}

const seoGlobalSchema = seoSchema.omit({ pages: true });
type SeoGlobal = Omit<SeoSettings, "pages">;

export function SeoEditor({ initial }: { initial: SeoGlobal }) {
  const { pages: _pages, ...defaults } = DEFAULT_DOCS.seo;
  void _pages;
  return (
    <InlineForm initial={initial} defaults={defaults} schema={seoGlobalSchema} onSave={(v) => saveSeoSettings(v)}>
      {({ value, set, errors }) => (
        <>
          <FormGroup title="Your business on Google">
            <TextField id="siteName" label="Business name" value={value.siteName} onChange={(v) => set(["siteName"], v)} error={errors.siteName} max={60} hint="Used by Google and social networks as the name of your website." />
            <TextField
              id="defaultDescription"
              label="Default description"
              value={value.defaultDescription}
              onChange={(v) => set(["defaultDescription"], v)}
              error={errors.defaultDescription}
              max={200}
              rows={3}
              hint="Used for any page that doesn't have its own description."
            />
            <ImageField
              id="shareImage"
              label="Default share picture"
              optional
              value={value.shareImage}
              onChange={(v) => set(["shareImage"], v)}
              error={errors.shareImage}
              aspect="aspect-[1200/630]"
              hint="Shown when a link to your website is shared on WhatsApp, Facebook, LinkedIn or X. Best size: 1200 × 630."
            />
            <TextField id="twitterHandle" label="X (Twitter) username" optional value={value.twitterHandle} onChange={(v) => set(["twitterHandle"], v)} error={errors.twitterHandle} placeholder="@xelvocreatives" />
          </FormGroup>

          <FormGroup title="Search engines">
            <ToggleField
              id="allowIndexing"
              label="Let search engines show my website"
              description="Switch off only while the website isn't ready: Google will stop listing every page."
              checked={value.allowIndexing}
              onChange={(v) => set(["allowIndexing"], v)}
            />
            <TextField
              id="googleVerification"
              label="Google Search Console code"
              optional
              value={value.googleVerification}
              onChange={(v) => set(["googleVerification"], v)}
              error={errors.googleVerification}
              placeholder="e.g. abc123XYZ…"
              hint={
                <>
                  In Search Console choose <strong className="text-xa-ink">HTML tag</strong> and paste only the code inside content=&quot;…&quot;. It proves you own the website.
                </>
              }
            />
            <TextField
              id="bingVerification"
              label="Bing Webmaster code"
              optional
              value={value.bingVerification}
              onChange={(v) => set(["bingVerification"], v)}
              error={errors.bingVerification}
              hint="Same idea for Bing: paste only the code."
            />
          </FormGroup>

          <FormGroup title="Visitor statistics">
            <TextField
              id="analyticsId"
              label="Google Analytics Measurement ID"
              optional
              value={value.analyticsId}
              onChange={(v) => set(["analyticsId"], v.trim().toUpperCase())}
              error={errors.analyticsId}
              placeholder="G-XXXXXXXXXX"
              hint="Find it in Google Analytics → Admin → Data streams. Once saved, visits to your public pages are counted (not admin pages)."
            />
          </FormGroup>
        </>
      )}
    </InlineForm>
  );
}
