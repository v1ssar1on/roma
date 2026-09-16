let cache = new Map()

export const fetchData = (url: string, fn: any) => {
	if (!cache.has(url)) {
		cache.set(url, fn(url))
	}

	return cache.get(url)
}
