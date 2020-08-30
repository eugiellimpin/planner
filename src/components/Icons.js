import React from "react";
import c from "classnames";

import { ReactComponent as MoveToInbox } from "../assets/inbox.svg";
import { ReactComponent as Trash } from "../assets/trash.svg";
import { ReactComponent as Chevron } from "../assets/chevron.svg";
import { ReactComponent as Schedule } from "../assets/schedule.svg";

const props = { height: "18", className: "text-gray-700 fill-current" };

export const MoveToInboxIcon = () => <MoveToInbox {...props} />;
export const TrashIcon = () => <Trash {...props} />;
export const ChevronRightIcon = () => <Chevron {...props} className={c(props.className, 'transform rotate-90')} />;
export const ChevronLeftIcon = () => <Chevron {...props} className={c(props.className, 'transform -rotate-90')} />;
export const ScheduleIcon = () => <Schedule {...props} />;