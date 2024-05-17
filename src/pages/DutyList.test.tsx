import { render, fireEvent, waitFor } from "@testing-library/react"
import { DutyList, __test } from "./DutyList"
import { ListItemProps } from "../types"

describe("ListItem component", () => {
    const inCompleteItemProps: ListItemProps = {
        id: 1,
        name: "Sample Duty",
        isCompleted: false,
        onDelete: jest.fn(),
        onComplete: jest.fn(),
    }

    const completedItemProps: ListItemProps = {
        id: 1,
        name: "Sample Duty",
        isCompleted: true,
        onDelete: jest.fn(),
        onComplete: jest.fn(),
    }

    it("renders the correct text for a non-completed duty", () => {
        const { getByText, queryByText } = render(<__test.ListItem {...inCompleteItemProps} />)
        expect(getByText("Sample Duty")).toBeInTheDocument()
        expect(queryByText("(Completed)")).toBeNull()
    })

    it("renders the correct text for a completed duty", () => {
        const { getByText } = render(<__test.ListItem {...completedItemProps} />)
        expect(getByText("Sample Duty (Completed)")).toBeInTheDocument()
    })

    it("calls onDelete function when delete button is clicked", async () => {
        const { getByTitle } = render(<__test.ListItem {...inCompleteItemProps} />)
        fireEvent.click(getByTitle("Delete"))
        await waitFor(() => {
            expect(inCompleteItemProps.onDelete).toHaveBeenCalledWith(1)
        })
    })

    it("calls onComplete function when complete button is clicked", async () => {
        const { getByTitle } = render(<__test.ListItem {...inCompleteItemProps} />)
        fireEvent.click(getByTitle("Complete"))
        await waitFor(() => {
            expect(inCompleteItemProps.onComplete).toHaveBeenCalledWith(1)
        })
    })

    it("disables complete button when duty is completed", () => {
        const { getByTitle } = render(<__test.ListItem {...completedItemProps} />)
        expect(getByTitle("Complete")).toBeDisabled()
    })
})
