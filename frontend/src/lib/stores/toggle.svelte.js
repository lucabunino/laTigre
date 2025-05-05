import { preloadData, pushState, goto, replaceState } from '$app/navigation';
import { getSlide  } from '$lib/stores/slide.svelte.js';
let slider = getSlide()
import { getCta  } from '$lib/stores/cta.svelte.js';
let ctaer = getCta()

let list = $state(false);
let studio = $state(false);
let work = $state(false);
let personal = $state(false);

export function getToggles() {	
	async function toggleList(e) {
    ctaer.setCta("")
		if (!list) {
      list = true
      studio = false
      work = false
      personal = false
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
    ctaer.setCta("")
    if (!studio) {
      list = false
      studio = true
      work = false
      personal = false
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

  async function toggleWork(e, slug) {
    ctaer.setCta("")
    if (!work) {
      list = false
      studio = false
      work = true
      personal = false
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
        pushState(href, { workData: result.data });
      } else {
        goto(href);
      } 
    } else {
      closeModal(true, e)
    }
  }

  async function changeWork(e, slug, index) {
    e.preventDefault();
    if (work) {
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
        replaceState(href, { workData: result.data });
      } else {
        goto(href);
      }
    }
    setTimeout(() => {
      slider.setSlide(index)
    }, 100);
  }

  async function togglePersonal(e, slug) {
    ctaer.setCta("")
    if (!personal) {
      list = false
      studio = false
      work = false
      personal = true
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
        pushState(href, { personalData: result.data });
      } else {
        goto(href);
      } 
    } else {
      closeModal(true, e)
    }
  }

  async function changePersonal(e, slug, index) {
    e.preventDefault();
    if (personal) {
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
        replaceState(href, { personalData: result.data });
      } else {
        goto(href);
      }
    }
    setTimeout(() => {
      slider.setSlide(index)
    }, 100);
  }

  async function closeModal(back, e) {
    ctaer.setCta("")
    if (e) {
      e.preventDefault()
    }
    list = false
    studio = false
    work = false
    personal = false
    if (back) {
      console.log("backedHistory");
      history.back()
    }
  }

	return {
		get list() {
			return list;
		},
		toggleList,
		get studio() {
			return studio;
		},
		toggleStudio,
		get work() {
			return work;
		},
		toggleWork,
    changeWork,
    get personal() {
			return personal;
		},
		togglePersonal,
    changePersonal,
    closeModal,
	};
}