import type { CheeseCategoryId } from '../data/cheeses';
import type { RouteId } from './Navbar';

interface FooterProps {
  onNavigate: (route: RouteId) => void;
  onSelectShopCategory: (category: CheeseCategoryId) => void;
}

export function Footer({ onNavigate, onSelectShopCategory }: FooterProps) {
  const handleNav = (route: RouteId, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(route);
  };

  return (
    <footer className="bg-[#F3F1ED] border-t border-[#E5E1D8] mt-20">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E5E1D8]">
          <div className="md:col-span-5">
            <a
              href="#start"
              onClick={(e) => handleNav('start', e)}
              className="font-serif text-2xl font-semibold text-[#171614] tracking-tight inline-block mb-3"
            >
              GOODcheese
            </a>
            <p className="text-sm text-[#5C5852] leading-relaxed max-w-[44ch] mb-4">
              Butikowy sklep internetowy z rzemieślniczymi serami z europejskich
              dojrzewalni. Kroimy świeżo z kręgu w dniu wysyłki i dostarczamy w
              kontrolowanym łańcuchu chłodniczym 2–6°C.
            </p>
            <p className="text-xs text-[#78736B]">
              Włochy · Francja · Szwajcaria · Hiszpania · Holandia · Grecja · Wielka Brytania · Cypr
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-sans text-sm font-semibold text-[#171614] mb-3">
              Nawigacja
            </h2>
            <ul className="space-y-2 text-sm text-[#5C5852]">
              <li>
                <a href="#start" onClick={(e) => handleNav('start', e)} className="hover:text-[#171614] transition-colors">
                  Start
                </a>
              </li>
              <li>
                <a href="#oferta" onClick={(e) => handleNav('oferta', e)} className="hover:text-[#171614] transition-colors">
                  Asortyment i przewodnik
                </a>
              </li>
              <li>
                <a href="#sklep" onClick={(e) => handleNav('sklep', e)} className="hover:text-[#171614] transition-colors">
                  Sklep internetowy
                </a>
              </li>
              <li>
                <a href="#o-nas" onClick={(e) => handleNav('o-nas', e)} className="hover:text-[#171614] transition-colors">
                  O dojrzewalni i dostawie
                </a>
              </li>
              <li>
                <a href="#kontakt" onClick={(e) => handleNav('kontakt', e)} className="hover:text-[#171614] transition-colors">
                  Kontakt i współpraca HoReCa
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="font-sans text-sm font-semibold text-[#171614] mb-3">
              Grupy serowarskie
            </h2>
            <ul className="space-y-2 text-sm text-[#5C5852]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectShopCategory('hard')}
                  className="hover:text-[#171614] transition-colors cursor-pointer text-left"
                >
                  01. Sery twarde i długo dojrzewające
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectShopCategory('semi')}
                  className="hover:text-[#171614] transition-colors cursor-pointer text-left"
                >
                  02. Sery półtwarde alpejskie i niderlandzkie
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectShopCategory('soft')}
                  className="hover:text-[#171614] transition-colors cursor-pointer text-left"
                >
                  03. Sery miękkie i z niebieską pleśnią
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectShopCategory('sheep')}
                  className="hover:text-[#171614] transition-colors cursor-pointer text-left"
                >
                  04. Sery owcze i kozie
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectShopCategory('grill')}
                  className="hover:text-[#171614] transition-colors cursor-pointer text-left"
                >
                  05. Sery na grilla i do zapiekania
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#78736B]">
          <p>© 2026 GOODcheese Sp. z o.o. · ul. Mokotowska 48, 00-543 Warszawa · Darmowa wysyłka chłodnicza od 180,00 zł.</p>
          <p>Świeżo krojone z kręgów ChNP · DOP · AOP</p>
        </div>
      </div>
    </footer>
  );
}
