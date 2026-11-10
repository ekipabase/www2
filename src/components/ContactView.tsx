import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { validateContactForm, type ContactFormInput } from '../utils/shopLogic';
import type { RouteId } from './Navbar';

interface ContactViewProps {
  onNavigate: (route: RouteId) => void;
}

interface SubmittedMessage extends ContactFormInput {
  referenceId: string;
  submittedAt: string;
}

export function ContactView({ onNavigate }: ContactViewProps) {
  const [form, setForm] = useState<ContactFormInput>({
    name: '',
    email: '',
    topic: 'Pytanie o sery i dobór do wina',
    message: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormInput, string>>>({});
  const [submittedHistory, setSubmittedHistory] = useState<SubmittedMessage[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const newRecord: SubmittedMessage = {
      ...form,
      referenceId: `ZAP-${String(104 + submittedHistory.length)}`,
      submittedAt: new Date().toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setSubmittedHistory((prev) => [newRecord, ...prev]);
    setForm({
      name: '',
      email: '',
      topic: 'Pytanie o sery i dobór do wina',
      message: '',
      consent: false,
    });
  };

  return (
    <div className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-10 pb-16">
      <div className="pb-10 border-b border-[#E5E1D8] mb-12">
        <p className="text-sm font-medium text-[#7A1F24] mb-2">
          Kontakt z affineurem i obsługą zamówień
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#171614] mb-3">
          Porozmawiajmy o serach
        </h1>
        <p className="text-base text-[#5C5852] max-w-[58ch]">
          Pomagamy dobrać sery pod konkretne wino, przyjęcie okolicznościowe lub
          kartę restauracyjną. Odpowiadamy tego samego dnia roboczego.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E5E1D8] rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#171614] mb-1">
                Pracownia i punkt odbioru
              </h2>
              <p className="text-sm text-[#5C5852]">
                ul. Mokotowska 48, 00-543 Warszawa
              </p>
              <p className="text-xs text-[#78736B] mt-1">
                Wtorek – Sobota: 10:00 – 19:00
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E1D8] space-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#5C5852]">Telefon doradcy</span>
                <span className="font-mono tabular-nums font-medium text-[#171614]">
                  +48 22 490 82 15
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#5C5852]">Zamówienia indywidualne</span>
                <span className="font-medium text-[#171614]">sklep@goodcheese.pl</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#5C5852]">Współpraca HoReCa / B2B</span>
                <span className="font-medium text-[#171614]">horeca@goodcheese.pl</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F3F1ED] border border-[#E5E1D8] rounded-2xl p-6">
            <h2 className="font-serif text-lg font-semibold text-[#171614] mb-2">
              Chcesz złożyć zamówienie od ręki?
            </h2>
            <p className="text-sm text-[#5C5852] leading-relaxed mb-4">
              Wszystkie 19 klasycznych serów oraz 3 skomponowane deski zamówisz
              bezpośrednio w naszym katalogu online z dostawą chłodniczą.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('sklep')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#171614] hover:bg-[#7A1F24] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Przejdź do sklepu →
            </button>
          </div>
        </div>

        {/* Right Validated Contact Form */}
        <div className="lg:col-span-7">
          <form
            noValidate
            onSubmit={handleSubmit}
            className="bg-white border border-[#E5E1D8] rounded-2xl p-6 sm:p-8 space-y-5"
          >
            <h2 className="font-serif text-2xl font-semibold text-[#171614]">
              Wyślij wiadomość
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-medium text-[#171614] mb-1.5"
                >
                  Imię i nazwisko *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  aria-invalid={Boolean(errors.name)}
                  placeholder="np. Anna Kowalska"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FCFBFA] border border-[#E5E1D8] rounded-lg text-[#171614] focus:outline-none focus:border-[#7A1F24]"
                />
                {errors.name && (
                  <p role="alert" className="text-xs text-[#7A1F24] mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-medium text-[#171614] mb-1.5"
                >
                  Adres e-mail *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={Boolean(errors.email)}
                  placeholder="anna@domena.pl"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FCFBFA] border border-[#E5E1D8] rounded-lg text-[#171614] focus:outline-none focus:border-[#7A1F24]"
                />
                {errors.email && (
                  <p role="alert" className="text-xs text-[#7A1F24] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-topic"
                className="block text-xs font-medium text-[#171614] mb-1.5"
              >
                Temat zapytania
              </label>
              <select
                id="contact-topic"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FCFBFA] border border-[#E5E1D8] rounded-lg text-[#171614] focus:outline-none focus:border-[#7A1F24]"
              >
                <option value="Pytanie o sery i dobór do wina">
                  Pytanie o sery i dobór do wina
                </option>
                <option value="Zamówienie okolicznościowe / deska na przyjęcie">
                  Zamówienie okolicznościowe / deska na przyjęcie
                </option>
                <option value="Współpraca gastronomiczna HoReCa">
                  Współpraca gastronomiczna HoReCa
                </option>
                <option value="Status wysyłki chłodniczej">
                  Status wysyłki chłodniczej
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-medium text-[#171614] mb-1.5"
              >
                Wiadomość *
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                aria-invalid={Boolean(errors.message)}
                placeholder="Napisz, jakich serów szukasz, dla ilu osób planujesz degustację lub jakie wino chcesz otworzyć..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#FCFBFA] border border-[#E5E1D8] rounded-lg text-[#171614] focus:outline-none focus:border-[#7A1F24]"
              />
              {errors.message && (
                <p role="alert" className="text-xs text-[#7A1F24] mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2.5 text-xs text-[#5C5852] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) =>
                    setForm({ ...form, consent: e.target.checked })
                  }
                  className="mt-0.5 rounded border-[#E5E1D8] accent-[#7A1F24]"
                />
                <span>
                  Wyrażam zgodę na przetwarzanie danych osobowych przez
                  GOODcheese Sp. z o.o. w celu udzielenia odpowiedzi na przesłane
                  zapytanie. *
                </span>
              </label>
              {errors.consent && (
                <p role="alert" className="text-xs text-[#7A1F24] mt-1">
                  {errors.consent}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold text-white bg-[#7A1F24] hover:bg-[#5E161A] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Wyślij wiadomość
            </button>
          </form>

          {/* Submitted Inquiries Confirmation State */}
          {submittedHistory.length > 0 && (
            <div
              aria-live="polite"
              className="mt-6 space-y-3"
            >
              {submittedHistory.map((msg) => (
                <div
                  key={msg.referenceId}
                  className="bg-[#F3F1ED] border border-[#E5E1D8] rounded-xl p-5"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171614]">
                      <CheckCircle2 className="w-4 h-4 text-[#7A1F24]" aria-hidden="true" />
                      <span>Wiadomość zarejestrowana ({msg.referenceId})</span>
                    </span>
                    <span className="font-mono tabular-nums text-xs text-[#5C5852]">
                      godz. {msg.submittedAt}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C5852] mb-1">
                    Nadawca: <strong className="text-[#171614]">{msg.name}</strong> ({msg.email}) · {msg.topic}
                  </p>
                  <p className="text-sm text-[#171614] leading-relaxed">
                    „{msg.message}”
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
