import { useCallback, useEffect, useState } from "react"
import { Alert, Button, Col, Flex, Form, FormProps, Input, List, Space } from "antd"
import { DeleteOutlined, CheckOutlined } from "@ant-design/icons"
import { ListItemProps, Duty, DutyFields } from "../types"

const ListItem = (props: ListItemProps) => {
    return (
        <List.Item>
            <Col span={4}>#{props.id}</Col>
            <Col span={16} style={{ textAlign: "left" }}>
                {props.name} {props.isCompleted ? "(Completed)" : ""}
            </Col>
            <Col span={4}>
                <Flex justify="space-between">
                    <Button
                        type="primary"
                        shape="circle"
                        title="Delete"
                        icon={<DeleteOutlined />}
                        onClick={() => props.onDelete(props.id)}
                    />
                    <Button
                        type="primary"
                        disabled={props.isCompleted}
                        shape="circle"
                        title="Complete"
                        icon={<CheckOutlined />}
                        onClick={() => props.onComplete(props.id)}
                    />
                </Flex>
            </Col>
        </List.Item>
    )
}

export const DutyList = () => {
    const [list, setList] = useState<Duty[]>([])
    const [form] = Form.useForm()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const getList = useCallback(() => {
        fetch(process.env.REACT_APP_BACKEND_URL + "/duties")
            .then(async (res) => {
                onFetchDone(res, async () => {
                    const result = await res.json()
                    setList(result)
                })
            })
            .catch(onCatchFetchError)
    }, [])

    useEffect(() => {
        getList()
    }, [getList])

    const addDuty: FormProps<DutyFields>["onFinish"] = (values) => {
        fetch(process.env.REACT_APP_BACKEND_URL + "/duties", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then(async (res) => {
                await onFetchDone(res, () => {
                    getList()
                    form.resetFields()
                })
            })
            .catch(onCatchFetchError)
    }

    const deleteDuty = (id: number) => {
        fetch(process.env.REACT_APP_BACKEND_URL + "/duties/" + id, {
            method: "DELETE",
        })
            .then(async (res) => {
                await onFetchDone(res, getList)
            })
            .catch(onCatchFetchError)
    }

    const completeDuty = (id: number) => {
        fetch(process.env.REACT_APP_BACKEND_URL + "/duties/" + id, {
            method: "PATCH",
        })
            .then(async (res) => {
                await onFetchDone(res, getList)
            })
            .catch(onCatchFetchError)
    }

    const onFetchDone = async (res: Response, callback: () => void) => {
        if (res.ok) {
            callback()
            setErrorMessage(null)
        } else {
            const err = await res.json()
            throw new Error(res.status + ": " + err.message)
        }
    }

    const onCatchFetchError = (err: Error) => {
        console.error(err)
        setErrorMessage(err.message)
    }

    return (
        <>
            {errorMessage && <Alert message={errorMessage} type="error" />}
            <List
                header={
                    <div>
                        <div style={{ margin: "5px" }}>Duties</div>
                        <Form form={form} onFinish={addDuty} style={{ width: "100%" }}>
                            <Form.Item<DutyFields>
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your duty!",
                                    },
                                ]}
                            >
                                <Space.Compact style={{ width: "100%" }}>
                                    <Input name="name" placeholder="Add new duty" />
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Space.Compact>
                            </Form.Item>
                        </Form>
                    </div>
                }
                bordered
                dataSource={list}
                renderItem={(item) => <ListItem {...item} onDelete={deleteDuty} onComplete={completeDuty} />}
            />
        </>
    )
}

export const __test = { ListItem }
