import { getGood } from '$lib/utils/sanity';
import { getGoodIndexes } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const good = await getGood(params.slug);
  const indexes = await getGoodIndexes();

  // This array will store all media from matching slugs, with their index
  var indexedMedia = [];
  let totalMedia = indexes.reduce((sum, good) => sum + (good.media?.length || 0), 0);
  let counter = 0;

  indexes.forEach(goodPersonal => {
    if (goodPersonal.media) {
      goodPersonal.media.forEach(mediaItem => {
        if (goodPersonal.slug.current == good[0].slug.current) {
          indexedMedia.push({
            ...mediaItem,
            _mediaIndex: (totalMedia - counter),
          });
        }
        counter++
      });
    }
  });
  
  if (good && indexedMedia) {
    return {
      good,
      indexedMedia,
    };
  }
  throw error(404, 'Not found');
}