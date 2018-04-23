import {addLocaleData} from 'react-intl';

import de from 'react-intl/locale-data/de';
import en from 'react-intl/locale-data/en';
import nl from 'react-intl/locale-data/nl';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';

let initializedIntl = false;
const initializeIntl = async () => {
  if (initializedIntl) {
    return;
  }

  // NOTE(longsleep): Add all locales which we want to support here.
  addLocaleData([
    ...de,
    ...en,
    ...nl,
    ...fr,
    ...es,
  ]);

  initializedIntl = true;
};

export default initializeIntl;
