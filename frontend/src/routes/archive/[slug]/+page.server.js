import { getWork } from '$lib/utils/sanity';
import { getIndexes } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const work = await getWork(params.slug);
  const indexes = await getIndexes();

  // This array will store all media from matching slugs, with their index
  var indexedMedia = [];
  let totalMedia = indexes.reduce((sum, work) => sum + (work.media?.length || 0), 0);
  let counter = 0;

  indexes.forEach(indexWork => {
    if (indexWork.media) {
      indexWork.media.forEach(mediaItem => {
        if (indexWork.slug.current == work[0].slug.current) {
          indexedMedia.push({
            ...mediaItem,
            _mediaIndex: (totalMedia - counter),
          });
        }
        counter++
      });
    }
  });
  
  if (work && indexedMedia) {
    return {
      work,
      indexedMedia,
    };
  }
  throw error(404, 'Not found');
}