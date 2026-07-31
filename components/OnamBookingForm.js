"use client";
import { useState } from "react";
import { IconCalendar, IconPin, IconPhone, IconWhatsApp } from "@/components/Icons";
import { onam, whatsappLink } from "@/lib/site";

// ---- Sadhya form ----------------------------------------------------------
// Field ids from the live "Onam Sadya Booking Form - Modern Catering".
// To re-derive after editing the form: open its /viewform URL, view source, and
// read the FB_PUBLIC_LOAD_DATA_ blob — each question's entry id is the first
// value of its field array.
const SF = {
  name: "entry.799352743",
  phone: "entry.318397183",
  packages: "entry.681656497",
  notes: "entry.2005561238",
};

// ---- Payasam form ---------------------------------------------------------
// Its own Google Form ("Onam Payasam Booking Form"), because the sadhya form
// makes the package count a required question.
const PF = {
  name: "entry.1890949304",
  phone: "entry.226153834",
  notes: "entry.813097463",
};

// Each payasam is its own radio question offering 1/2/3 LTR, with "Other"
// enabled for larger amounts — so quantities land in their own sheet column
// rather than in one free-text blob.
const PAYASAMS = [
  {
    value: "parippu",
    name: "Parippu Pradhaman",
    label: "Parippu Pradhaman / പരിപ്പ് പ്രഥമൻ",
    entry: "entry.1094338839",
  },
  {
    value: "palada",
    name: "Palada Pradhaman",
    label: "Palada Pradhaman / പാലട പ്രഥമൻ",
    entry: "entry.974434665",
  },
  {
    value: "pazham",
    name: "Pazham Pradhaman",
    label: "Pazham Pradhaman / പഴം പ്രഥമൻ",
    entry: "entry.328325546",
  },
];

const payasamReady = Boolean(
  onam.payasamFormPostUrl && PF.name && PF.phone && PAYASAMS.every((p) => p.entry)
);

// The packages question has "Other" enabled, so counts above 3 are sent as
// Google's __other_option__ token plus a companion free-text field.
const OTHER = "__other_option__";

let rowSeq = 0;
const newRow = () => ({ key: ++rowSeq, kind: "", qty: 1 });

// Indian digit grouping (2,800 / 28,000 / 2,80,000). Written out rather than
// using toLocaleString so the server and browser can't disagree on the format.
function inr(n) {
  const s = String(Math.round(n));
  if (s.length <= 3) return `₹${s}`;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `₹${rest},${last3}`;
}

const SADHYA_PRICE = Number(onam.sadhya.price) || 0;
const PAYASAM_PRICE = Number(onam.payasams[0]?.price) || 0;

const FOCUS_TARGET = {
  name: "#obf-name",
  phone: "#obf-phone",
  packages: "input[name$='other_option_response'], #obf-packages-more",
  payasam: ".obf__addonpick",
};

function validateContact(data, F) {
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
  return errors;
}

export default function OnamBookingForm() {
  const [tab, setTab] = useState("sadhya");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [packages, setPackages] = useState("1");
  const [moreCount, setMoreCount] = useState("");
  const [rows, setRows] = useState([newRow()]);
  const [errors, setErrors] = useState({});
  const [placed, setPlaced] = useState(null); // estimate kept for the confirmation

  const isPayasam = tab === "payasam";

  // Live estimate. Quantities drive it, so it updates as the order is built.
  const estimate = (() => {
    const lines = [];
    if (isPayasam) {
      for (const r of rows) {
        const opt = PAYASAMS.find((p) => p.value === r.kind);
        if (!opt) continue;
        const qty = Math.max(1, Number(r.qty) || 1);
        lines.push({ label: `${opt.name}, ${qty} ltr`, amount: qty * PAYASAM_PRICE });
      }
    } else {
      const n = packages === OTHER ? Number(moreCount) || 0 : Number(packages) || 0;
      if (n > 0) {
        lines.push({
          label: `Sadhya × ${n} (serves ${n * Number(onam.sadhya.serves || 0)})`,
          amount: n * SADHYA_PRICE,
        });
      }
    }
    return { lines, total: lines.reduce((s, l) => s + l.amount, 0) };
  })();

  const clearErr = (key) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const switchTab = (next) => {
    if (next === tab) return;
    setTab(next);
    setErrors({});
    setStatus("idle");
  };

  const setRow = (key, patch) => {
    clearErr("payasam");
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };
  const dropRow = (key) => {
    clearErr("payasam");
    setRows((rs) => rs.filter((r) => r.key !== key));
  };

  const taken = new Set(rows.map((r) => r.kind));
  const allPicked = rows.length >= PAYASAMS.length;

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const F = isPayasam ? PF : SF;

    const found = validateContact(data, F);
    if (isPayasam) {
      if (!rows.length || rows.every((r) => !r.kind)) {
        found.payasam = "Choose at least one payasam to order.";
      } else if (rows.some((r) => !r.kind)) {
        found.payasam = "Choose a payasam for each row, or remove the empty one.";
      } else if (rows.some((r) => !(Number(r.qty) >= 1))) {
        found.payasam = "Payasam quantity needs to be at least 1 litre.";
      }
    } else if (data.get(F.packages) === OTHER) {
      const count = Number(data.get(`${F.packages}.other_option_response`));
      if (!count) found.packages = "Tell us how many sadhya packages you need.";
      else if (count < 4) found.packages = "For 3 or fewer, please pick a number above.";
    }

    const order = isPayasam ? ["name", "phone", "payasam"] : ["name", "phone", "packages"];
    const firstBad = order.find((k) => found[k]);
    if (firstBad) {
      setErrors(found);
      const el = form.querySelector(FOCUS_TARGET[firstBad]);
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});

    if (isPayasam) {
      // Each payasam is its own short-text question, so the litres go straight
      // in with no ceiling. Unordered ones are left blank in the sheet.
      for (const r of rows) {
        const opt = PAYASAMS.find((p) => p.value === r.kind);
        if (!opt) continue;
        data.set(opt.entry, `${Math.max(1, Number(r.qty) || 1)} LTR`);
      }
    } else if (data.get(F.packages) !== OTHER) {
      data.delete(`${F.packages}.other_option_response`);
    }

    // Sent as x-www-form-urlencoded, matching a real Google Form submission.
    // Handing fetch a FormData object instead makes it multipart/form-data,
    // which /formResponse does not reliably parse — the request succeeds but
    // the row never appears. Repeated keys survive the conversion.
    const body = new URLSearchParams();
    for (const [k, v] of data.entries()) body.append(k, v);
    body.append("fvv", "1");
    body.append("pageHistory", "0");

    setStatus("sending");
    try {
      // The response is opaque (no CORS on Google Forms), so this confirms the
      // request left the browser — not that Google accepted it.
      await fetch(isPayasam ? onam.payasamFormPostUrl : onam.formPostUrl, {
        method: "POST",
        mode: "no-cors",
        body,
      });
      // Snapshot before the reset wipes the inputs the estimate is built from.
      setPlaced({ ...estimate, type: isPayasam ? "payasam" : "sadhya" });
      setStatus("done");
      form.reset();
      setPackages("1");
      setMoreCount("");
      setRows([newRow()]);
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    const placedPayasam = placed?.type === "payasam";
    return (
      <div className="obf obf--done" role="status">
        <span className="obf__tick" aria-hidden="true">✓</span>

        <p className="obf__kind">
          {placedPayasam ? "Payasam Order" : "Onam Sadhya Booking"}
        </p>

        <h3 lang="ml">🎉 നിങ്ങളുടെ ബുക്കിംഗ് വിജയകരമായി ലഭിച്ചു!</h3>

        {/* the noun changes with what was actually ordered */}
        <p lang="ml">
          {placedPayasam
            ? "നിങ്ങളുടെ പായസം ഓർഡർ വിജയകരമായി സ്വീകരിച്ചിരിക്കുന്നു."
            : "നിങ്ങളുടെ ഓണസദ്യ ബുക്കിംഗ് വിജയകരമായി സ്വീകരിച്ചിരിക്കുന്നു."}
        </p>

        {placed && placed.total > 0 && (
          <div className="obf__est obf__est--placed">
            {placed.lines.map((l) => (
              <p className="obf__estline" key={l.label}>
                <span>{l.label}</span>
                <span>{inr(l.amount)}</span>
              </p>
            ))}
            <p className="obf__estsum">
              <span>Estimated total</span>
              <strong>{inr(placed.total)}</strong>
            </p>
            <p className="obf__estnote">
              An estimate only. We&apos;ll confirm the final amount on the call.
            </p>
          </div>
        )}

        {/* the two order types have different collection windows */}
        <p className="obf__collect">
          <IconCalendar aria-hidden="true" />
          <span>
            Collect on <strong>{onam.collectionDateLabel}</strong>,{" "}
            {placedPayasam ? onam.payasamTime.toLowerCase() : onam.sadhyaTime}, from{" "}
            {onam.pickup}.
          </span>
        </p>

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
          Place Another Order
        </button>
      </div>
    );
  }

  const F = isPayasam ? PF : SF;

  return (
    <div className="obf__wrap">
      {/* Two separate orders, not one form with extras */}
      <div className="obf__tabs" role="tablist" aria-label="What are you ordering?">
        <button
          type="button"
          role="tab"
          aria-selected={!isPayasam}
          className={`obf__tab${!isPayasam ? " is-active" : ""}`}
          onClick={() => switchTab("sadhya")}
        >
          Onam Sadhya
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isPayasam}
          className={`obf__tab${isPayasam ? " is-active" : ""}`}
          onClick={() => switchTab("payasam")}
        >
          Payasam Only
        </button>
      </div>

      {isPayasam && !payasamReady ? (
        <div className="obook__closed">
          <h3>Payasam orders by phone</h3>
          <p>
            Payasam is ordered separately from the sadhya. Call or message us with
            the payasams and litres you need, and we&apos;ll confirm your order.
            Collection from {onam.pickup}, {onam.payasamTime.toLowerCase()}.
          </p>
          <div className="obook__actions">
            <a href={onam.bookingPhone.tel} className="btn btn--dark">
              <IconPhone /> Call {onam.bookingPhone.display}
            </a>
            <a
              href={whatsappLink(
                `Hi, I'd like to order payasam for Onam ${onam.year}.`
              )}
              className="btn btn--gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconWhatsApp /> WhatsApp Us
            </a>
          </div>
        </div>
      ) : (
        <form className="obf" onSubmit={onSubmit} noValidate>
          <div className="obf__when">
            {onam.collectionDateLabel && (
              <p>
                <IconCalendar aria-hidden="true" />
                <span>
                  Collect on <strong>{onam.collectionDateLabel}</strong>, Thiruvonam day.
                </span>
              </p>
            )}
            <p>
              <IconPin aria-hidden="true" />
              <span>
                <strong>No delivery.</strong> All orders are collected from{" "}
                {onam.pickup}.{" "}
                {isPayasam
                  ? `Payasam ${onam.payasamTime.toLowerCase()}.`
                  : `Sadhya ${onam.sadhyaTime}.`}
              </span>
            </p>
          </div>

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

          {isPayasam ? (
            <fieldset className="obf__field obf__field--full">
              <legend>
                Payasam <span lang="ml">/ പായസം</span>{" "}
                <i>(₹{onam.payasams[0].price} per litre)</i>
              </legend>

              {rows.length > 0 && (
                <div className="obf__addons">
                  {rows.map((r) => (
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
                            disabled={r.kind !== p.value && taken.has(p.value)}
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
                        disabled={rows.length === 1}
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
                  onClick={() => setRows((rs) => [...rs, newRow()])}
                >
                  <span className="obf__addicon" aria-hidden="true">+</span>
                  {rows.length ? "Add another payasam" : "Add payasam"}
                </button>
              )}
            </fieldset>
          ) : (
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
                    value={moreCount}
                    onChange={(e) => {
                      clearErr("packages");
                      setMoreCount(e.target.value);
                    }}
                  />
                )}
              </div>
              {errors.packages && <p className="obf__err">{errors.packages}</p>}
              <p className="obf__hint">
                Each package serves {onam.sadhya.serves}, at ₹{onam.sadhya.price} per package.
              </p>
            </fieldset>
          )}

          <div className="obf__field obf__field--full">
            <label htmlFor="obf-notes">
              Special Instructions <span lang="ml">/ പ്രത്യേക നിർദ്ദേശങ്ങൾ</span>{" "}
              <i>(optional)</i>
            </label>
            <textarea
              id="obf-notes"
              name={F.notes}
              rows={2}
              placeholder="Collection time, dietary notes, anything else"
            />
          </div>

          {estimate.total > 0 && (
            <div className="obf__est">
              {estimate.lines.map((l) => (
                <p className="obf__estline" key={l.label}>
                  <span>{l.label}</span>
                  <span>{inr(l.amount)}</span>
                </p>
              ))}
              <p className="obf__estsum">
                <span>Estimated total</span>
                <strong>{inr(estimate.total)}</strong>
              </p>
              <p className="obf__estnote">
                An estimate only. We&apos;ll confirm the final amount when we call.
              </p>
            </div>
          )}

          <div className="obf__submit">
            <button type="submit" className="btn btn--gold" disabled={status === "sending"}>
              {status === "sending"
                ? "Sending…"
                : isPayasam
                  ? "Confirm Payasam Order"
                  : "Confirm Booking"}
            </button>
            <p className="obf__fine">
              We&apos;ll call you to confirm. No payment is taken on this form.
            </p>
          </div>

          {status === "error" && (
            <p className="obf__error" role="alert">
              Something went wrong sending your order.{" "}
              <a
                href={isPayasam ? onam.payasamFormUrl : onam.formUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Use the Google Form instead ↗
              </a>{" "}
              or call {onam.bookingPhone.display}.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
