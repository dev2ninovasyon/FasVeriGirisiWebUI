import { uniqueId } from "lodash";

export interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  parentTitle?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
  aciklama?: string;
}
import {
  IconPoint,
  IconUpload,
  IconFilters,
  IconTimeline,
  IconFolderOpen,
  IconFileDescription,
  IconFolderUp,
  IconTrendingUp,
  IconFileCheck,
  IconLayoutGridAdd,
  IconScript,
  IconUsersGroup,
  IconHierarchy,
  IconInfoCircle,
  IconFileAnalytics,
  IconUsers,
  IconHome,
  IconCalculator,
  IconRepeat,
  IconRecycle,
} from "@tabler/icons-react";

export function createMenuItems(denetimTuru: string): MenuitemsType[] {
  return [
    {
      id: uniqueId(),
      title: "Amortisman",
      icon: IconCalculator,
      href: "/Amortisman",
    },
  ];
}
