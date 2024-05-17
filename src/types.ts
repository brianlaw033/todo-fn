export type Duty = {
    id: number
    name: string
    isCompleted: boolean
}

export type DutyFields = {
    name: string
}

export type ListItemProps = {
    onDelete: (id: number) => void
    onComplete: (id: number) => void
} & Duty
