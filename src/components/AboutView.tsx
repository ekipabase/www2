import { ArrowRight } from 'lucide-react';
import { CheeseImage } from './CheeseImage';
import type { RouteId } from './Navbar';

interface AboutViewProps {
  onNavigate: (route: RouteId) => void;
}

export function AboutView({ onNavigate }: AboutViewProps) {
  return (
    <div className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-10 pb-16">
      {/* Header */}
      <div className="pb-10 border-b border-[#E5E1D8] mb-12">
        <p className="text-sm font-medium text-[#7A1F24] mb-2">
          O marce GOODcheese
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#171614] max-w-[20ch] mb-4">
          Europejskie rzemiosło serowarskie bez pośredników
        </h1>
        <p className="text-base sm:text-lg text-[#5C5852] leading-relaxed max-w-[64ch]">
          GOODcheese powstało z myślą o osobach, które szukają w Polsce
          prawdziwego Comté z Jury, owczego Roqueforta z grot Combalou czy
          dwuletniego Parmigiano Reggiano — krojonych ze świeżego kręgu, a nie z
          przemysłowych plastrów w plastiku.
        </p>
      </div>

      {/* Split Story + Cellar Photography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch mb-16">
        <div className="lg:col-span-6 flex flex-col">
          <div className="relative flex-1 min-h-[340px] rounded-2xl overflow-hidden border border-[#E5E1D8]">
            <CheeseImage
              mediaKey="cellar"
              alt="Tradycyjna europejska dojrzewalnia serów z kręgami na dębowych regałach"
              className="w-full h-full lg:absolute lg:inset-0"
              imgClassName="lg:h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div>
            <span className="font-mono tabular-nums text-xs font-semibold text-[#7A1F24] block mb-1">
              01. Pochodzenie i certyfikaty ChNP / AOP
            </span>
            <h2 className="font-serif text-2xl font-semibold text-[#171614] mb-2">
              Współpracujemy z rodzinnymi mleczarniami i affineurami
            </h2>
            <p className="text-sm sm:text-base text-[#5C5852] leading-relaxed">
              Sprowadzamy całe kręgi oraz bloki bezpośrednio z ośmiu krajów
              Europy: Włoch, Francji, Szwajcarii, Hiszpanii, Holandii, Grecji,
              Wielkiej Brytanii oraz Cypru. Stawiamy na sery z mleka
              niepasteryzowanego oraz chronione apelacjami pochodzenia.
            </p>
          </div>

          <div className="pt-5 border-t border-[#E5E1D8]">
            <span className="font-mono tabular-nums text-xs font-semibold text-[#7A1F24] block mb-1">
              02. Cięcie w dniu wysyłki
            </span>
            <h2 className="font-serif text-2xl font-semibold text-[#171614] mb-2">
              Oddychający papier serowarski i łańcuch chłodniczy
            </h2>
            <p className="text-sm sm:text-base text-[#5C5852] leading-relaxed">
              Każde zamówienie odkrawamy ręcznie rano przed przyjazdem kuriera.
              Porcje zawijamy w dwuwarstwowy papier woskowany używany we
              francuskich fromageriach i umieszczamy w boksach izotermicznych z
              wkładami chłodzącymi utrzymującymi temperaturę 2–6°C przez 48
              godzin.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('sklep')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#171614] hover:bg-[#7A1F24] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Przejdź do sklepu</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('kontakt')}
              className="px-5 py-3 text-sm font-semibold text-[#171614] bg-white hover:bg-[#F3F1ED] border border-[#E5E1D8] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Zapytaj o dobór serów
            </button>
          </div>
        </div>
      </div>

      {/* Company & Logistics Data Grid */}
      <section className="bg-[#F3F1ED] border border-[#E5E1D8] rounded-2xl p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#171614] mb-3">
              Standard wysyłki chłodniczej
            </h2>
            <ul className="space-y-2 text-sm text-[#5C5852]">
              <li>Wysyłki realizujemy od poniedziałku do czwartku (gwarancja dostawy przed weekendem)</li>
              <li>Koszt paczki izotermicznej: <span className="font-mono tabular-nums text-[#171614] font-medium">19,90 zł</span></li>
              <li>Bezpłatna dostawa dla zamówień od <span className="font-mono tabular-nums text-[#171614] font-medium">180,00 zł</span></li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-[#171614] mb-3">
              Dla restauracji i winiarni (HoReCa)
            </h2>
            <p className="text-sm text-[#5C5852] leading-relaxed mb-3">
              Zaopatrujemy autorskie bistra, wine bary oraz hotele butikowe w
              całe kręgi i ćwiartki serów wraz z kartami opisowymi dla obsługi
              kelnerskiej.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('kontakt')}
              className="text-xs font-semibold text-[#7A1F24] hover:text-[#5E161A] transition-colors cursor-pointer"
            >
              Napisz w sprawie cennika hurtowego →
            </button>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-[#171614] mb-3">
              Dane rejestrowe i pracownia
            </h2>
            <dl className="space-y-1.5 text-sm text-[#5C5852]">
              <div>
                <dt className="inline text-[#78736B]">Podmiot: </dt>
                <dd className="inline font-medium text-[#171614]">GOODcheese Sp. z o.o.</dd>
              </div>
              <div>
                <dt className="inline text-[#78736B]">Pracownia i odbiór: </dt>
                <dd className="inline text-[#171614]">ul. Mokotowska 48, 00-543 Warszawa</dd>
              </div>
              <div>
                <dt className="inline text-[#78736B]">NIP: </dt>
                <dd className="inline font-mono tabular-nums text-[#171614]">525-294-18-40</dd>
              </div>
              <div>
                <dt className="inline text-[#78736B]">Kontakt: </dt>
                <dd className="inline text-[#171614]">sklep@goodcheese.pl</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
