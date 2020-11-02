import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EllipsisOutlined
} from "@ant-design/icons";
import { notification } from "antd";
import Button from "antd/lib/button";
import Card from "antd/lib/card";
import Meta from "antd/lib/card/Meta";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
import Skeleton from "antd/lib/skeleton";
import gql from "graphql-tag";
import moment from "moment";
import React from "react";
import { Query } from "@apollo/client/react/components";
import { QueryResult } from "@apollo/client/react/types/types";
import { TTask } from "../../types/task";
import { apolloClient } from "../common/apollo-client";
import { Preloader } from "../common/preloader";
import { colors } from "../common/styles/style-color";
import { subscribePush } from "../common/subscribe-web-push";

const TASKS_QUERY = gql`
  query userTasks($contactId: String) {
    getUserTasks(contactId: $contactId) {
      id
      title
      done
      contacts
      rrule
      due
      ownerId
    }
  }
`;

const UPSERT_TASK = gql`
  mutation upsertTask($upsertTaskInput: UpsertTaskInput!) {
    upsertTask(upsertTaskInput: $upsertTaskInput) {
      id
      title
      done
      contacts
      rrule
      due
      ownerId
    }
  }
`;

const DELETE_TASK = gql`
  mutation deleteTask($id: String!) {
    deleteTask(id: $id)
  }
`;

function pastDue(date?: Date): boolean {
  if (!date) {
    return true;
  }
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return new Date(date) < d;
}

function dateToDT(date: Date): string {
  return date
    .toISOString()
    .replace(/\.\d+/g, "")
    .replace(/[^A-Za-z0-9\s]/g, "")
    .replace(/\s{2,}/g, " ");
}

const FREQ_TO_DAYS: Record<string, number> = {
  WEEKLY: 7,
  BIWEEKLY: 14,
  MONTHLY: 30,
  QUARTERLY: 90,
  YEARLY: 365
};

function getRrule(frequency: string | undefined): string | null {
  if (!frequency) {
    return null;
  }

  const d = new Date();
  d.setDate(d.getDate() + FREQ_TO_DAYS[frequency] || 0);

  switch (frequency) {
    case "WEEKLY":
    case "MONTHLY":
    case "YEARLY":
      return `DTSTART=${dateToDT(d)} FREQ=${frequency};INTERVAL=1`;
    case "BIWEEKLY":
      return `DTSTART=${dateToDT(d)} FREQ=WEEKLY;INTERVAL=2`;
    case "QUARTERLY":
      return `DTSTART=${dateToDT(d)} FREQ=MONTHLY;INTERVAL=3`;
    default:
  }
  return null;
}

const upsertTaskFn = ({
  taskId,
  contactId,
  frequency,
  doneFn,
  delayedFn
}: {
  taskId?: string;
  contactId?: string;
  frequency?: string;
  doneFn?: () => unknown;
  delayedFn?: () => unknown;
}) => async () => {
  await apolloClient.mutate({
    mutation: UPSERT_TASK,
    variables: {
      upsertTaskInput: {
        id: taskId,
        title: "reminder",
        rrule: getRrule(frequency),
        contacts: contactId && [contactId],
        done: doneFn && doneFn(),
        delayed: delayedFn && delayedFn()
      }
    },
    refetchQueries: [
      {
        query: TASKS_QUERY,
        variables: {
          contactId
        }
      }
    ]
  });
  notification.success({ message: "Reminder updated!" });
};

const deleteTaskFn = (taskId: string, contactId: string) => async () => {
  await apolloClient.mutate({
    mutation: DELETE_TASK,
    variables: {
      id: taskId
    },
    refetchQueries: [
      {
        query: TASKS_QUERY,
        variables: {
          contactId
        }
      }
    ]
  });
  notification.success({ message: "Reminder deleted!" });
};

const subscribeFn = (contactId: string) => async () => {
  const subscribed = await subscribePush();
  if (!subscribed) {
    notification.error({
      message: "failed to subscribe"
    });
    return;
  }

  upsertTaskFn({ contactId, frequency: "WEEKLY" })();
};

const getActions = (task: TTask | undefined | null) =>
  task && task.id
    ? [
        <CheckCircleOutlined
          key="1"
          onClick={upsertTaskFn({
            taskId: task.id,
            doneFn: () => new Date()
          })}
        />,
        <ClockCircleOutlined
          key="2"
          onClick={upsertTaskFn({
            taskId: task.id,
            delayedFn: () => new Date()
          })}
        />,
        <div key="3">
          <Dropdown
            overlay={
              <Menu>
                {Object.keys(FREQ_TO_DAYS).map(f => (
                  <Menu.Item
                    key={f}
                    onClick={upsertTaskFn({
                      taskId: task.id,
                      frequency: f
                    })}
                  >
                    {f}
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <EllipsisOutlined />
          </Dropdown>
        </div>
      ]
    : [];

export function ReminderCard({
  contactId
}: {
  contactId: string;
}): JSX.Element {
  return (
    <Query
      query={TASKS_QUERY}
      variables={{
        contactId
      }}
    >
      {({
        data,
        error,
        loading
      }: QueryResult<{ getUserTasks: Array<TTask> }>) => {
        if (loading || error || !data) {
          return <Preloader />;
        }

        const task = data.getUserTasks && data.getUserTasks[0];
        let title = "Add Reminder";
        if (task) {
          if (pastDue(task.due)) {
            title = "It's time...";
          } else {
            title = moment(task.due).fromNow();
          }
        }

        return (
          <Card style={{ width: "100%" }} actions={getActions(task)}>
            <Skeleton loading={loading} avatar active>
              <Meta
                avatar={
                  task && task.id ? (
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: colors.success,
                        borderColor: colors.success
                      }}
                      onClick={deleteTaskFn(task.id, contactId)}
                      shape="circle"
                      icon={<BellOutlined />}
                    />
                  ) : (
                    <Button
                      onClick={subscribeFn(contactId)}
                      shape="circle"
                      icon={<BellOutlined />}
                    />
                  )
                }
                title={title}
                description={task && "to touch base"}
              />
            </Skeleton>
          </Card>
        );
      }}
    </Query>
  );
}
