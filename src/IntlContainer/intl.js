import { addLocaleData } from 'react-intl';

// Always import english first.
import en from 'react-intl/locale-data/en';

// Please keep imports alphabetically sorted. These imports also need to be
// kept in sync with the translations in i18n/locales.
import de from 'react-intl/locale-data/de';
import fr from 'react-intl/locale-data/fr';
import hi from 'react-intl/locale-data/hi';
import nb from 'react-intl/locale-data/nb';
import nl from 'react-intl/locale-data/nl';
import pt from 'react-intl/locale-data/pt';
import ru from 'react-intl/locale-data/ru';

let initializedIntl = false;
export const initializeIntl = async () => {
  if (initializedIntl) {
    return;
  }

  // NOTE(longsleep): Add all locales which we want to support here.
  addLocaleData([
    ...en,

    ...de,
    ...fr,
    ...hi,
    ...nb,
    ...nl,
    ...pt,
    ...ru,
  ]);

  initializedIntl = true;
};

export default initializeIntl;
