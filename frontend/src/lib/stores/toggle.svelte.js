import { preloadData, pushState, goto, replaceState } from '$app/navigation';
import { getSlide  } from '$lib/stores/slide.svelte.js';
let slider = getSlide()

let list = $state(false);
let studio = $state(false);
let single = $state(false);
let firstLoaded = $state(false)

export function getToggles() {

  async function setFirstLoaded() {
		firstLoaded = true
	}
	
	async function toggleList(e) {
		if (!list) {
      single = false
      list = true
      studio = false
      let href;
      if (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        href = e.currentTarget;
      } else {
        href = '/archive/list'
      }
      const result = await preloadData(href);
      if (result.type === 'loaded' && result.status === 200) {
        pushState(href, { listData: result.data });
      } else {
        goto(href);
      } 
    } else {
      closeModal(true, e)
    }
	}

  async function toggleStudio(e) {
    if (!studio) {
      single = false
      list = false
      studio = true
      let href;
      if (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        href = e.currentTarget;
      } else {
        href = '/studio'
      }
      const result = await preloadData(href);
      if (result.type === 'loaded' && result.status === 200) {
        pushState(href, { studioData: result.data });
      } else {
        goto(href);
      }
    } else {
      closeModal(true, e)
    }
  }

  async function toggleSingle(e, slug) {
    if (!single) {
      single = true
      list = false
      studio = false
      let href;
      if (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        href = e.currentTarget;
      } else {
        href = slug
      }
      const result = await preloadData(href);
      if (result.type === 'loaded' && result.status === 200) {
        pushState(href, { singleData: result.data });
      } else {
        goto(href);
      } 
    } else {
      closeModal(true, e)
    }
  }

  async function changeSingle(e, slug, index) {
    e.preventDefault();
    if (single) {
      let href;
      if (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        href = e.currentTarget;
      } else {
        href = slug
      }
      const result = await preloadData(href);
      if (result.type === 'loaded' && result.status === 200) {
        replaceState(href, { singleData: result.data });
      } else {
        goto(href);
      }
    }
    setTimeout(() => {
      slider.setSlide(index)
    }, 100);
  }

  async function closeModal(back, e) {
    if (e) {
      e.preventDefault()
    }
    single = false
    list = false
    studio = false
    if (back) {
      console.log("backedHistory");
      history.back()
    }
  }

	return {
    setFirstLoaded,
    closeModal,
		get list() {
			return list;
		},
		toggleList,
		get studio() {
			return studio;
		},
		toggleStudio,
		get single() {
			return single;
		},
		toggleSingle,
    changeSingle,
	};
}