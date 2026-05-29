type JsonLdProps = {
  data: Record<string, unknown> | readonly Record<string, unknown>[];
};

/** Inline JSON-LD for rich results (server-rendered). */
export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
