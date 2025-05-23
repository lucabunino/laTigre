import { getThing } from '$lib/utils/sanity';
import { getThingIndexes } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const thing = await getThing(params.slug);
  const indexes = await getThingIndexes();

  // This array will store all media from matching slugs, with their index
  var indexedMedia = [];
  let totalMedia = indexes.reduce((sum, thing) => sum + (thing.media?.length || 0), 0);
  let counter = 0;

  indexes.forEach(thingPersonal => {
    if (thingPersonal.media) {
      thingPersonal.media.forEach(mediaItem => {
        if (thingPersonal.slug.current == thing[0].slug.current) {
          indexedMedia.push({
            ...mediaItem,
            _mediaIndex: (totalMedia - counter),
          });
        }
        counter++
      });
    }
  });
  
  if (thing && indexedMedia) {
    return {
      thing,
      indexedMedia,
    };
  }
  throw error(404, 'Not found');
}