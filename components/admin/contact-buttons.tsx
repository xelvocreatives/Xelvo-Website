import { Mail, MessageCircle, Phone } from "lucide-react";
import { XaButton } from "@/components/admin/kit/button";
import { emailLink, whatsappLink } from "@/lib/admin-format";

/** One-tap ways to reply: WhatsApp first (how the studio works), then email. */
export function ContactButtons({
  name,
  email,
  phone,
  whatsappMessage,
  emailSubject,
  compact,
  showCall,
}: {
  name: string;
  email: string;
  phone?: string | null;
  whatsappMessage: string;
  emailSubject: string;
  compact?: boolean;
  showCall?: boolean;
}) {
  const wa = whatsappLink(phone, whatsappMessage);
  const digits = (phone ?? "").replace(/[^\d+]/g, "");

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {wa && (
          <XaButton asChild variant="whatsapp" size="icon">
            <a href={wa} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${name}`}>
              <MessageCircle />
            </a>
          </XaButton>
        )}
        <XaButton asChild variant="secondary" size="icon">
          <a href={emailLink(email, emailSubject)} aria-label={`Email ${name}`}>
            <Mail />
          </a>
        </XaButton>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {wa && (
        <XaButton asChild variant="whatsapp">
          <a href={wa} target="_blank" rel="noreferrer">
            <MessageCircle />
            WhatsApp
          </a>
        </XaButton>
      )}
      <XaButton asChild variant="secondary">
        <a href={emailLink(email, emailSubject)}>
          <Mail />
          Email
        </a>
      </XaButton>
      {showCall && digits.length >= 8 && (
        <XaButton asChild variant="secondary">
          <a href={`tel:${digits}`}>
            <Phone />
            Call
          </a>
        </XaButton>
      )}
    </div>
  );
}
