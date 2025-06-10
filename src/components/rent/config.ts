export type CategoryDto = {
	categoryId: number
	name: string
	description: string
}

export type ConstructionDto = {
	constructionEquipId: number
	categoryId: number
	name: string
	permission: boolean
	pricePerDay: number
	zdjecieLink: string
}

export type ConstructionResponse = {
	constructionDto: ConstructionDto
	categoryDto: CategoryDto
}

export type PageData = {
	content: ConstructionResponse[]
	pageable: {
		pageNumber: number
		pageSize: number
		sort: { sorted: boolean }
	}
	last: boolean
	totalPages: number
	totalElements: number
	first: boolean
	size: number
	number: number
	numberOfElements: number
	empty: boolean
}
