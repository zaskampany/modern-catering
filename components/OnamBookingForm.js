"use client";
import { useState } from "react";
import { IconCalendar } from "@/components/Icons";
import { onam } from "@/lib/site";

// Field ids belong to the live "Onam Sadya Booking Form - Modern Catering".
// A Google Form can't be restyled from outside its iframe (cross-origin), so
// this posts the same fields to the same endpoint and responses land in the
// same linked sheet.
//
// To re-derive these after editing the form: open its /viewform URL, view
// source, and read the FB_PUBLIC_LOAD_DATA_ blob — each question's entry id is
// the first value of its field array. If they ever drift, set
// NEXT_PUBLIC_ONAM_FORM_EMBED=yes to fall back to the plain embed.
const F = {
  name: "entry.799352743",
  phone: "entry.318397183",
  packages: "entry.681656497",
  address: "entry.1725755080",
  payasam: "entry.1306248642",
  notes: "entry.2005561238",
};

// The payasam question is free text now, so these values no longer have to
// match anything on Google's side — `name` is what gets written into it.
// English leads the label so the three stay distinguishable even when a narrow
// phone truncates the closed select; they differ on their first word.
const PAYASAMS = [
  { value: "parippu", name: "Parippu Pradhaman", label: "Parippu Pradhaman / പരിപ്പ് പ്രഥമൻ" },
  { value: "palada", name: "Palada Pradhaman", label: "Palada Pradhaman / പാലട പ്രഥമൻ" },
  { value: "pazham", name: "Pazham Pradhaman", label: "Pazham Pradhaman / പഴം പ്രഥമൻ" },
];

// The packages question has "Other" enabled, so counts above 3 are sent as
// Google's __other_option__ token plus a companion free-text field.
const OTHER = "__other_option__";

let rowSeq = 0;
const newRow = () => ({ key: ++rowSeq, kind: "", qty: 1 });

// Checked in this order, so the page scrolls to the topmost problem first.
const FIELD_ORDER = ["name", "phone", "packages", "address", "payasam"];
const FOCUS_TARGET = {
  name: "#obf-name",
  phone: "#obf-phone",
  packages: "input[name$='other_option_response'], #obf-packages-more",
  address: "#obf-address",
  payasam: ".obf__addonpick",
};

// Our own messages instead of the browser's "Please fill out this field."
function validate(data, addons) {
  const errors = {};

  if (!String(data.get(F.name) || "").trim()) {
    errors.name = "Please tell us your name so we know whose order this is.";
  }

  const phone = String(data.get(F.phone) || "").trim();
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (!phone) {
    errors.phone = "We need a phone number, as our team calls to confirm every order.";
  } else if (digits.length !== 10) {
    errors.phone = "That doesn't look right. Please enter a 10-digit mobile number.";
  } else if (!/^[6-9]/.test(digits)) {
    errors.phone = "Indian mobile numbers start with 6, 7, 8 or 9. Please check it.";
  }

  if (data.get(F.packages) === OTHER) {
    const count = Number(data.get(`${F.packages}.other_option_response`));
    if (!count) errors.packages = "Tell us how many sadhya packages you need.";
    else if (count < 4) errors.packages = "For 3 or fewer, please pick a number above.";
  }

  if (!String(data.get(F.address) || "").trim()) {
    errors.address = "We deliver to your door, so please add an address.";
  }

  if (addons.some((r) => !r.kind)) {
    errors.payasam = "Choose a payasam for each row, or remove the empty one.";
  } else if (addons.some((r) => !(Number(r.qty) >= 1))) {
    errors.payasam = "Payasam quantity needs to be at least 1 litre.";
  }

  return errors;
}

export default function OnamBookingForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [packages, setPackages] = useState("1");
  const [addons, setAddons] = useState([]);
  const [errors, setErrors] = useState({});

  // Clear a message as soon as the customer starts fixing that field.
  const clearErr = (key) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const setRow = (key, patch) => {
    clearErr("payasam");
    setAddons((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };
  const dropRow = (key) => {
    clearErr("payasam");
    setAddons((rows) => rows.filter((r) => r.key !== key));
  };

  // Options already chosen, so the same payasam can't be picked twice —
  // quantity is how you order more of one.
  const takenValues = new Set(addons.map((r) => r.kind));
  const allPicked = addons.length >= PAYASAMS.length;

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const found = validate(data, addons);
    const firstBad = FIELD_ORDER.find((k) => found[k]);
    if (firstBad) {
      setErrors(found);
      const el = form.querySelector(FOCUS_TARGET[firstBad]);
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});

    // The companion field only belongs on the request when "More" is selected.
    if (data.get(F.packages) !== OTHER) data.delete(`${F.packages}.other_option_response`);

    // The payasam question is a long-text field now, so the whole add-on order
    // goes in as one line:
    //   "Parippu Pradhaman — 8 LTR, Palada Pradhaman — 5 LTR"
    const summary = [];
    for (const r of addons) {
      if (!r.kind) continue;
      const qty = Math.max(1, Number(r.qty) || 1);
      const opt = PAYASAMS.find((p) => p.value === r.kind);
      summary.push(`${opt ? opt.name : r.kind} — ${qty} LTR`);
    }
    data.set(F.payasam, summary.join(", "));

    setStatus("sending");
    try {
      // The response is opaque (no CORS on Google Forms), so this confirms the
      // request left the browser — not that Google accepted it.
      await fetch(onam.formPostUrl, { method: "POST", mode: "no-cors", body: data });
      setStatus("done");
      form.reset();
      setPackages("1");
      setAddons([]);
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="obf obf--done" role="status">
        <span className="obf__tick" aria-hidden="true">✓</span>

        <h3 lang="ml">🎉 നിങ്ങളുടെ ബുക്കിംഗ് വിജയകരമായി ലഭിച്ചു!</h3>

        <p lang="ml">നിങ്ങളുടെ ഓണസദ്യ ബുക്കിംഗ് വിജയകരമായി സ്വീകരിച്ചിരിക്കുന്നു.</p>

        <p lang="ml">
          ഓർഡർ സ്ഥിരീകരിക്കുന്നതിനും തുടർ വിവരങ്ങൾ അറിയിക്കുന്നതിനുമായി ഞങ്ങളുടെ ടീം
          5 മണിക്കൂറിനുള്ളിൽ WhatsApp വഴി നിങ്ങളെ ബന്ധപ്പെടുന്നതാണ്.
        </p>

        <p lang="ml">
          5 മണിക്കൂറിനുള്ളിൽ WhatsApp സന്ദേശം ലഭിക്കാത്ത പക്ഷം, ദയവായി ഈ നമ്പറിൽ ബന്ധപ്പെടുക:
        </p>

        {/* Real number pulled from config so it can't drift from the poster. */}
        <a className="obf__donephone" href={onam.bookingPhone.tel}>
          📞 {onam.bookingPhone.display}
        </a>

        <p lang="ml">ഈ ഓണത്തിന് ഞങ്ങളെ തിരഞ്ഞെടുത്തതിന് നന്ദി. സന്തോഷകരമായ ഓണാശംസകൾ! 🌼</p>

        <button type="button" className="btn btn--dark" onClick={() => setStatus("idle")}>
          Book Another
        </button>
      </div>
    );
  }

  return (
    /* noValidate — the browser's own bubbles are replaced by the messages below */
    <form className="obf" onSubmit={onSubmit} noValidate>
      {onam.deliveryDateLabel && (
        <p className="obf__when">
          <IconCalendar aria-hidden="true" />
          <span>
            Delivering on <strong>{onam.deliveryDateLabel}</strong>, Thiruvonam day.
          </span>
        </p>
      )}

      <div className="obf__row">
        <div className="obf__field">
          <label htmlFor="obf-name">
            Full Name <span lang="ml">/ മുഴുവൻ പേര്</span>
          </label>
          <input
            id="obf-name"
            name={F.name}
            type="text"
            placeholder="Your name"
            className={errors.name ? "is-invalid" : undefined}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "obf-name-err" : undefined}
            onInput={() => clearErr("name")}
          />
          {errors.name && <p className="obf__err" id="obf-name-err">{errors.name}</p>}
        </div>

        <div className="obf__field">
          <label htmlFor="obf-phone">
            Phone Number <span lang="ml">/ ഫോൺ നമ്പർ</span>
          </label>
          <input
            id="obf-phone"
            name={F.phone}
            type="tel"
            inputMode="tel"
            placeholder="10-digit mobile number"
            className={errors.phone ? "is-invalid" : undefined}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "obf-phone-err" : undefined}
            onInput={() => clearErr("phone")}
          />
          {errors.phone && <p className="obf__err" id="obf-phone-err">{errors.phone}</p>}
        </div>
      </div>

      <fieldset className="obf__field obf__field--full">
        <legend>
          Number of Sadya Packages <span lang="ml">/ സദ്യ പാക്കേജുകളുടെ എണ്ണം</span>
        </legend>
        <div className="obf__chips">
          {["1", "2", "3"].map((n) => (
            <label key={n} className={`obf__chip${packages === n ? " is-on" : ""}`}>
              <input
                type="radio"
                name={F.packages}
                value={n}
                checked={packages === n}
                onChange={() => {
                  clearErr("packages");
                  setPackages(n);
                }}
              />
              {n}
            </label>
          ))}
          <label className={`obf__chip${packages === OTHER ? " is-on" : ""}`}>
            <input
              id="obf-packages-more"
              type="radio"
              name={F.packages}
              value={OTHER}
              checked={packages === OTHER}
              onChange={() => {
                clearErr("packages");
                setPackages(OTHER);
              }}
            />
            More
          </label>
          {packages === OTHER && (
            <input
              className={`obf__other${errors.packages ? " is-invalid" : ""}`}
              name={`${F.packages}.other_option_response`}
              type="number"
              min="4"
              placeholder="How many?"
              aria-label="Number of packages"
              aria-invalid={errors.packages ? true : undefined}
              onInput={() => clearErr("packages")}
            />
          )}
        </div>
        {errors.packages && <p className="obf__err">{errors.packages}</p>}
        <p className="obf__hint">
          Each package serves {onam.sadhya.serves}, at ₹{onam.sadhya.price} per package.
        </p>
      </fieldset>

      <div className="obf__field obf__field--full">
        <label htmlFor="obf-address">
          Delivery Address <span lang="ml">/ ഡെലിവറി വിലാസം</span>
        </label>
        <textarea
          id="obf-address"
          name={F.address}
          rows={3}
          placeholder="House name, street, landmark, area"
          className={errors.address ? "is-invalid" : undefined}
          aria-invalid={errors.address ? true : undefined}
          aria-describedby={errors.address ? "obf-address-err" : undefined}
          onInput={() => clearErr("address")}
        />
        {errors.address && <p className="obf__err" id="obf-address-err">{errors.address}</p>}
      </div>

      <fieldset className="obf__field obf__field--full">
        <legend>
          Add-on Payasam <span lang="ml">/ അധിക പായസം</span>{" "}
          <i>(optional, ₹{onam.payasams[0].price} per litre)</i>
        </legend>

        {addons.length > 0 && (
          <div className="obf__addons">
            {addons.map((r) => (
              <div className="obf__addon" key={r.key}>
                <select
                  className={`obf__addonpick${errors.payasam && !r.kind ? " is-invalid" : ""}`}
                  value={r.kind}
                  onChange={(e) => setRow(r.key, { kind: e.target.value })}
                  aria-label="Payasam"
                  aria-invalid={errors.payasam && !r.kind ? true : undefined}
                >
                  <option value="">Select payasam…</option>
                  {PAYASAMS.map((p) => (
                    <option
                      key={p.value}
                      value={p.value}
                      disabled={r.kind !== p.value && takenValues.has(p.value)}
                    >
                      {p.label}
                    </option>
                  ))}
                </select>

                <div className="obf__qty">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={r.qty}
                    onChange={(e) => setRow(r.key, { qty: e.target.value })}
                    aria-label="Quantity in litres"
                  />
                  <span>ltr</span>
                </div>

                <button
                  type="button"
                  className="obf__drop"
                  onClick={() => dropRow(r.key)}
                  aria-label="Remove this payasam"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.payasam && <p className="obf__err">{errors.payasam}</p>}

        {!allPicked && (
          <button
            type="button"
            className="obf__add"
            onClick={() => setAddons((rows) => [...rows, newRow()])}
          >
            <span className="obf__addicon" aria-hidden="true">+</span>
            {addons.length ? "Add another payasam" : "Add payasam"}
          </button>
        )}
      </fieldset>

      <div className="obf__field obf__field--full">
        <label htmlFor="obf-notes">
          Special Instructions <span lang="ml">/ പ്രത്യേക നിർദ്ദേശങ്ങൾ</span>{" "}
          <i>(optional)</i>
        </label>
        <textarea
          id="obf-notes"
          name={F.notes}
          rows={2}
          placeholder="Delivery time, dietary notes, anything else"
        />
      </div>

      <div className="obf__submit">
        <button type="submit" className="btn btn--gold" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Confirm Booking"}
        </button>
        <p className="obf__fine">
          We&apos;ll call you to confirm. No payment is taken on this form.
        </p>
      </div>

      {status === "error" && (
        <p className="obf__error" role="alert">
          Something went wrong sending your booking.{" "}
          <a href={onam.formUrl} target="_blank" rel="noopener noreferrer">
            Use the Google Form instead ↗
          </a>{" "}
          or call {onam.bookingPhone.display}.
        </p>
      )}
    </form>
  );
}
