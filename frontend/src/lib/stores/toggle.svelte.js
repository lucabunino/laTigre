import { preloadData, pushState, goto, replaceState } from '$app/navigation';
import { getSlide  } from '$lib/stores/slide.svelte.js';
let slider = getSlide()
import { getCta  } from '$lib/stores/cta.svelte.js';
let ctaer = getCta()

let list = $state(false);
let studio = $state(false);
let work = $state(false);
let good = $state(false);
let last = $state(false);

export function getToggles() {	

	async function toggleList(e) {
    ctaer.setCta("")
		if (!list) {
      last = "list"
      list = true
      studio = false
      work = false
      good = false
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
      closeModal(true, true, e)
    }
	}

  async function toggleStudio(e) {
    ctaer.setCta("")
    if (!studio) {
      last = "studio"
      list = false
      studio = true
      work = false
      good = false
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
      closeModal(true, false, e)
    }
  }

  async function toggleWork(e, slug, fromHome) {
    ctaer.setCta("")
    if (fromHome) {
      last = "home"
    }
    if (!work) {
      if (last !== "list" && !fromHome) {
       last = "work" 
      }
      list = false
      studio = false
      work = true
      good = false
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
      closeModal(true, false, e)
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

  async function toggleGood(e, slug, fromHome) {
    ctaer.setCta("")
    if (fromHome) {
      last = "home"
    }
    if (!good) {
      if (!fromHome) {
       last = "good"
      }
      list = false
      studio = false
      work = false
      good = true
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
        pushState(href, { goodData: result.data });
      } else {
        goto(href);
      } 
    } else {
      closeModal(true, false, e)
    }
  }

  async function changeGood(e, slug, index) {
    e.preventDefault();
    if (good) {
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
        replaceState(href, { goodData: result.data });
      } else {
        goto(href);
      }
    }
    setTimeout(() => {
      slider.setSlide(index)
    }, 100);
  }

  async function closeModal(back, closeList, e) {
    ctaer.setCta("")
    if (e) {
      e.preventDefault()
    }
    if (!closeList && last == "list") {
      toggleList()
    } else {
      last = null
      list = false
    }
    studio = false
    work = false
    good = false
    if (back) {
      history.back()
    }
  }

	return {
    get last() {
			return last;
		},
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
    get good() {
			return good;
		},
		toggleGood,
    changeGood,
    closeModal,
	};
}