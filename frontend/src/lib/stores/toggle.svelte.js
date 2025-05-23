import { preloadData, pushState, goto, replaceState } from '$app/navigation';
import { getSlide  } from '$lib/stores/slide.svelte.js';
let slider = getSlide()
import { getCta  } from '$lib/stores/cta.svelte.js';
let ctaer = getCta()

let list = $state(false);
let info = $state(false);
let work = $state(false);
let thing = $state(false);
let last = $state(false);

export function getToggles() {	

	async function toggleList(e) {
    ctaer.setCta("")
		if (!list) {
      last = "list"
      list = true
      info = false
      work = false
      thing = false
      let href;
      if (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        href = e.currentTarget;
      } else {
        href = '/works/list'
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

  async function toggleInfo(e) {
    ctaer.setCta("")
    if (!info) {
      last = "info"
      list = false
      info = true
      work = false
      thing = false
      let href;
      if (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        href = e.currentTarget;		
      } else {
        href = '/info'
      }
      const result = await preloadData(href);
      if (result.type === 'loaded' && result.status === 200) {
        pushState(href, { infoData: result.data });
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
      info = false
      work = true
      thing = false
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

  async function toggleThing(e, slug, fromHome) {
    ctaer.setCta("")
    if (fromHome) {
      last = "home"
    }
    if (!thing) {
      if (!fromHome) {
       last = "thing"
      }
      list = false
      info = false
      work = false
      thing = true
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
        pushState(href, { thingData: result.data });
      } else {
        goto(href);
      } 
    } else {
      closeModal(true, false, e)
    }
  }

  async function changeThing(e, slug, index) {
    e.preventDefault();
    if (thing) {
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
        replaceState(href, { thingData: result.data });
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
    info = false
    work = false
    thing = false
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
		get info() {
			return info;
		},
		toggleInfo,
		get work() {
			return work;
		},
		toggleWork,
    changeWork,
    get thing() {
			return thing;
		},
		toggleThing,
    changeThing,
    closeModal,
	};
}