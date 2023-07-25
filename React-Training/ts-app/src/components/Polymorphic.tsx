import React from "react";

type PolymorphicOwnProps<T extends React.ElementType> = {
  size?: "sm" | "md" | "xl";
  color?: "primary" | "secondary";
  children?: React.ReactNode;
  as?: T;
};

type PolymorphicProps<T extends React.ElementType> = PolymorphicOwnProps<T> &
  Omit<React.ComponentProps<T>, keyof PolymorphicOwnProps<T>>;

export const Polymorphic = <T extends React.ElementType = "div">({
  size,
  color,
  children,
  as,
}: PolymorphicProps<T>) => {
  const Component = as || "div";
  return (
    <Component className={`class-name-${size}-${color}`}>{children}</Component>
  );
};
