const pages = {
  privacy: {
    title: "Privacy Policy",
    updated: "November 2026",
    sections: [
      ["What we collect", "Your name, email address and, if you add one, a profile photo. If you sign in with Google we receive your name, email and profile picture from Google. We also store the movies you add and the movies you mark as favorites."],
      ["How we use it", "To sign you in, show your favorites, send one-time codes to confirm your email and reset your password, and credit you on movies you add. We do not sell your data and we do not show ads."],
      ["What is public", "Browsing the catalogue needs no account. The name you sign up with is shown on movies you add. Your favorites list and email address are private. Administrators can see member names, emails and how many movies each member added."],
      ["Newsletter", "If you subscribe we store your email address to send the occasional update. Subscribing is optional and you can ask us to remove your address at any time."],
      ["Where it is stored", "Account, movie and favorites data is stored in a MongoDB database. Profile photos are hosted on an image service. Emails are sent through our mail provider."],
      ["Your choices", "You can change your name, photo, email and password in Account settings, and delete your account at any time. Deleting it removes your profile, your favorites and the movies you added."],
      ["Cookies and storage", "We keep your sign-in token and your light or dark theme preference in your browser's local storage. There are no tracking or advertising cookies."],
      ["Movie information", "Details of the sample movies come from Wikipedia and are used under its licence. Posters belong to their respective studios and are shown to identify the films."],
      ["Test accounts", "The shared test accounts on the sign-in page are public. Do not store anything private in them."],
    ],
  },
  terms: {
    title: "Terms of Use",
    updated: "November 2026",
    sections: [
      ["Using Movie Portal", "Movie Portal is a free personal project for browsing and sharing movies. By creating an account or signing in you agree to these terms."],
      ["Your account", "Keep your password safe. You are responsible for activity on your account. Tell us if you think someone else has access to it."],
      ["Movies you add", "You may add movies with a poster link, genre, rating and summary. Only add accurate information and images you may link to, and nothing unlawful, abusive or misleading. You can edit or delete your own movies at any time."],
      ["Moderation", "Administrators may remove movies or suspend accounts that break these terms."],
      ["Acceptable use", "Do not try to break, overload or gain unauthorised access to the service or to other people's data, and do not use automated tools to create accounts or movies in bulk."],
      ["Test accounts", "Shared test accounts are provided for trying the portal. They are reset from time to time and some actions, such as changing settings or editing the sample catalogue, are disabled."],
      ["Availability", "The service is provided as is, with no guarantee that it will always be available or free of errors. Features may change or be removed."],
      ["Ending your account", "You can delete your account at any time in Account settings."],
      ["Changes", "We may update these terms. Continuing to use Movie Portal after a change means you accept the new version."],
    ],
  },
};

export default function Legal({ page }) {
  const doc = pages[page];
  return (
    <article className="frame max-w-3xl py-14">
      <span className="eyeline">Legal</span>
      <h1 className="display mt-4 text-[clamp(34px,5vw,56px)]">{doc.title}</h1>
      <p className="mt-3 text-sm text-muted">Last updated {doc.updated}</p>
      <div className="mt-10 space-y-8">
        {doc.sections.map(([heading, text]) => (
          <section key={heading}>
            <h2 className="text-lg font-bold tracking-tight">{heading}</h2>
            <p className="mt-2 leading-relaxed text-muted">{text}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
