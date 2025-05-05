import { getPersonal } from '$lib/utils/sanity';
import { getPersonalIndexes } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const personal = await getPersonal(params.slug);
  const indexes = await getPersonalIndexes();

  // This array will store all media from matching slugs, with their index
  var indexedMedia = [];
  let totalMedia = indexes.reduce((sum, personal) => sum + (personal.media?.length || 0), 0);
  let counter = 0;

  indexes.forEach(indexPersonal => {
    if (indexPersonal.media) {
      indexPersonal.media.forEach(mediaItem => {
        if (indexPersonal.slug.current == personal[0].slug.current) {
          indexedMedia.push({
            ...mediaItem,
            _mediaIndex: (totalMedia - counter),
          });
        }
        counter++
      });
    }
  });
  
  if (personal && indexedMedia) {
    return {
      personal,
      indexedMedia,
    };
  }
  throw error(404, 'Not found');
}