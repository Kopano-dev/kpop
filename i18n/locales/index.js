// NOTE(longsleep): This loads all translation files to be included in the
// app bundle. They are not that large.

// Please keep imports and exports alphabetically sorted.
import de from './de.json';
import es from './es.json';
import fr from './fr.json';
import hu from './hu.json';
import it from './it.json';
import ja from './ja.json';
import nb from './nb.json';
import nl from './nl.json';
import ptPT from './pt_PT.json';
import ru from './ru.json';

// Locales must follow BCP 47 format (https://tools.ietf.org/html/rfc5646).
export const locales = {
  de,
  'en-GB': {},
  'en-US': {},
  es,
  fr,
  hu,
  it,
  ja,
  nb,
  nl,
  'pt-PT': ptPT,
  ru,
};

export default locales;

/**
 * Helper function to merge two locale objects into one. The function will
 * return a new locales object, containing all keys from l1 and l2, having
 * keys from l2 override keys from l1.
 */
export function mergeLocales(l1, l2) {
  const l = {
    ...l1,
  };
  for (let locale of Object.keys(l2)) {
    l[locale] = {
      ...l1[locale],
      ...l2[locale],
    };
  }
  return l;
}

/**
 * Helper function to merge two locale objects into one, returning only a
 * single locale.
 */
export function mergeLocale(l1, l2, locale) {
  l1 = l1 ? l1 : {};
  l2 = l2 ? l2 : {};
  const localeBase = locale.split('-', 1)[0];
  if (localeBase !== locale) {
    return {
      ...l1[localeBase],
      ...l1[locale],
      ...l2[localeBase],
      ...l2[locale],
    };
  } else {
    return {
      ...l1[locale],
      ...l2[locale],
    };
  }
}

/**
 * Helper function to simplify initialization of app locale together with
 * locale defined by kpop.
 */
export function defineLocale(appLocales, locale) {
  return mergeLocale(locales, appLocales, locale);
}

/**
 * Helper function to simplify initialization of app locales together with
 * locales defined by kpop.
 */
export function defineLocales(appLocales) {
  return mergeLocales(locales, appLocales);
}
