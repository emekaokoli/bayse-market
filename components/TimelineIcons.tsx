"use client";

import * as React from "react";
import Image from "next/image";
interface GenericIconProps {
  decorative: boolean;
  title?: string;
  size?: number;
}

function createCustomIcon(src: string, alt: string) {
  const CustomIcon: React.FC<React.PropsWithChildren<GenericIconProps>> = (props) => {
    return (
      <Image
        src={src}
        alt={props.decorative ? "" : props.title || alt}
        width={24}
        height={24}
      />
    );
  };
  CustomIcon.displayName = alt;
  return CustomIcon;
}

export const IconCheckedGreen = createCustomIcon("/icon-checked-green.png", "Checked Green");
export const IconCheckedGrey = createCustomIcon("/icon-checked-grey.png", "Checked Grey");
