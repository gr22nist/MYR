// components/icons/IconSet.js

import React from 'react';
import Icon from './BaseIcon';

export const PhotoAdd = ({
  title,
  width = 32,
  height = 32,
  viewBox = "0 0 32 32",
  children = null,
  ...props
}) => (
  <Icon title={title} width={width} height={height} viewBox={viewBox} {...props}>
    <path d="M29.3331 18.5332V21.5866C29.3331 26.4399 26.4398 29.3332 21.5864 29.3332H10.4131C7.01309 29.3332 4.55975 27.9066 3.41309 25.3732L3.55975 25.2666L10.1198 20.8666C11.1864 20.1466 12.6931 20.2266 13.6398 21.0532L14.0931 21.4266C15.1331 22.3199 16.8131 22.3199 17.8531 21.4266L23.3998 16.6666C24.4398 15.7732 26.1198 15.7732 27.1598 16.6666L29.3331 18.5332Z" fill=""/>
    <path opacity="0.4" d="M27.9603 10.6665H24.0403C22.347 10.6665 21.3337 9.65317 21.3337 7.95984V4.03984C21.3337 3.5065 21.4403 3.05317 21.627 2.6665C21.6137 2.6665 21.6003 2.6665 21.587 2.6665H10.4137C5.56033 2.6665 2.66699 5.55984 2.66699 10.4132V21.5865C2.66699 23.0398 2.92033 24.3065 3.41366 25.3732L3.56033 25.2665L10.1203 20.8665C11.187 20.1465 12.6937 20.2265 13.6403 21.0532L14.0937 21.4265C15.1337 22.3198 16.8137 22.3198 17.8537 21.4265L23.4003 16.6665C24.4403 15.7732 26.1203 15.7732 27.1603 16.6665L29.3337 18.5332V10.4132C29.3337 10.3998 29.3337 10.3865 29.3337 10.3732C28.947 10.5598 28.4937 10.6665 27.9603 10.6665Z" fill=""/>
    <path d="M12.0005 13.8398C13.7531 13.8398 15.1738 12.4191 15.1738 10.6665C15.1738 8.91391 13.7531 7.49316 12.0005 7.49316C10.2479 7.49316 8.82715 8.91391 8.82715 10.6665C8.82715 12.4191 10.2479 13.8398 12.0005 13.8398Z" fill=""/>
    <path d="M27.9597 1.3335H24.0397C22.3463 1.3335 21.333 2.34683 21.333 4.04016V7.96016C21.333 9.6535 22.3463 10.6668 24.0397 10.6668H27.9597C29.653 10.6668 30.6663 9.6535 30.6663 7.96016V4.04016C30.6663 2.34683 29.653 1.3335 27.9597 1.3335ZM29.213 6.5735C29.0797 6.70683 28.8797 6.80016 28.6663 6.8135H26.7863L26.7997 8.66683C26.7863 8.8935 26.7063 9.08016 26.5463 9.24016C26.413 9.3735 26.213 9.46683 25.9997 9.46683C25.5597 9.46683 25.1997 9.10683 25.1997 8.66683V6.80016L23.333 6.8135C22.893 6.8135 22.533 6.44016 22.533 6.00016C22.533 5.56016 22.893 5.20016 23.333 5.20016L25.1997 5.2135V3.34683C25.1997 2.90683 25.5597 2.5335 25.9997 2.5335C26.4397 2.5335 26.7997 2.90683 26.7997 3.34683L26.7863 5.20016H28.6663C29.1063 5.20016 29.4663 5.56016 29.4663 6.00016C29.453 6.22683 29.3597 6.4135 29.213 6.5735Z" fill=""/>
  </Icon>
);

export const PhotoRemove = ({
  title,
  width = 32,
  height = 32,
  viewBox = "0 0 32 32",
  ...props
}) => (
  <Icon title={title} width={width} height={height} viewBox={viewBox} {...props}>
    <path d="M29.3331 18.5332V21.5866C29.3331 26.4399 26.4398 29.3332 21.5864 29.3332H10.4131C7.01309 29.3332 4.55975 27.9066 3.41309 25.3732L3.55975 25.2666L10.1198 20.8666C11.1864 20.1466 12.6931 20.2266 13.6398 21.0532L14.0931 21.4266C15.1331 22.3199 16.8131 22.3199 17.8531 21.4266L23.3998 16.6666C24.4398 15.7732 26.1198 15.7732 27.1598 16.6666L29.3331 18.5332Z" fill=""/>
    <path opacity="0.4" d="M27.9603 10.6665H24.0403C22.347 10.6665 21.3337 9.65317 21.3337 7.95984V4.03984C21.3337 3.5065 21.4403 3.05317 21.627 2.6665C21.6137 2.6665 21.6003 2.6665 21.587 2.6665H10.4137C5.56033 2.6665 2.66699 5.55984 2.66699 10.4132V21.5865C2.66699 23.0398 2.92033 24.3065 3.41366 25.3732L3.56033 25.2665L10.1203 20.8665C11.187 20.1465 12.6937 20.2265 13.6403 21.0532L14.0937 21.4265C15.1337 22.3198 16.8137 22.3198 17.8537 21.4265L23.4003 16.6665C24.4403 15.7732 26.1203 15.7732 27.1603 16.6665L29.3337 18.5332V10.4132C29.3337 10.3998 29.3337 10.3865 29.3337 10.3732C28.947 10.5598 28.4937 10.6665 27.9603 10.6665Z" fill=""/>
    <path d="M12.0005 13.8398C13.7531 13.8398 15.1738 12.4191 15.1738 10.6665C15.1738 8.91391 13.7531 7.49316 12.0005 7.49316C10.2479 7.49316 8.82715 8.91391 8.82715 10.6665C8.82715 12.4191 10.2479 13.8398 12.0005 13.8398Z" fill=""/>
    <path d="M27.9597 1.3335H24.0397C22.3463 1.3335 21.333 2.34683 21.333 4.04016V7.96016C21.333 9.6535 22.3463 10.6668 24.0397 10.6668H27.9597C29.653 10.6668 30.6663 9.6535 30.6663 7.96016V4.04016C30.6663 2.34683 29.653 1.3335 27.9597 1.3335ZM28.6263 7.4135C28.9597 7.74683 28.9597 8.2935 28.6263 8.62683C28.453 8.78683 28.2397 8.86683 28.013 8.86683C27.7997 8.86683 27.5863 8.78683 27.413 8.62683L25.9997 7.2135L24.5997 8.62683C24.4263 8.78683 24.213 8.86683 23.9863 8.86683C23.773 8.86683 23.5597 8.78683 23.3863 8.62683C23.053 8.2935 23.053 7.74683 23.3863 7.4135L24.7997 6.00016L23.3863 4.60016C23.053 4.26683 23.053 3.72016 23.3863 3.38683C23.7197 3.0535 24.2663 3.0535 24.5997 3.38683L25.9997 4.80016L27.413 3.38683C27.7463 3.0535 28.293 3.0535 28.6263 3.38683C28.9597 3.72016 28.9597 4.26683 28.6263 4.60016L27.213 6.00016L28.6263 7.4135Z" fill=""/>
  </Icon>
);

export const AddBtn = ({
  title,
  width = 24,
  height = 24,
  viewBox = "0 0 24 24",
  ...props
}) => (
  <Icon title={title} width={width} height={height} viewBox={viewBox} {...props}>
    <path d="M16 12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z" fill=""/>
    <path d="M12 16.75C11.59 16.75 11.25 16.41 11.25 16V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V16C12.75 16.41 12.41 16.75 12 16.75Z" fill=""/>
    <path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" fill=""/>
  </Icon>
);

export const DeleteBtn = ({
  title,
  width = 24,
  height = 24,
  viewBox = "0 0 24 24",
  ...props
}) => (
  <Icon title={title} width={width} height={height} viewBox={viewBox} {...props}>
    <path d="M9.17035 15.58C8.98035 15.58 8.79035 15.51 8.64035 15.36C8.35035 15.07 8.35035 14.59 8.64035 14.3L14.3004 8.63999C14.5904 8.34999 15.0704 8.34999 15.3604 8.63999C15.6504 8.92999 15.6504 9.40998 15.3604 9.69998L9.70035 15.36C9.56035 15.51 9.36035 15.58 9.17035 15.58Z" fill=""/>
    <path d="M14.8304 15.58C14.6404 15.58 14.4504 15.51 14.3004 15.36L8.64035 9.69998C8.35035 9.40998 8.35035 8.92999 8.64035 8.63999C8.93035 8.34999 9.41035 8.34999 9.70035 8.63999L15.3604 14.3C15.6504 14.59 15.6504 15.07 15.3604 15.36C15.2104 15.51 15.0204 15.58 14.8304 15.58Z" fill=""/>
    <path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" fill=""/>
  </Icon>
);

export const EditBtn = ({
  title,
  width = 24,
  height = 24,
  viewBox = "0 0 24 24",
  ...props
}) => (
  <Icon title={title} width={width} height={height} viewBox={viewBox} {...props}>
    <path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H11C11.41 1.25 11.75 1.59 11.75 2C11.75 2.41 11.41 2.75 11 2.75H9C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V13C21.25 12.59 21.59 12.25 22 12.25C22.41 12.25 22.75 12.59 22.75 13V15C22.75 20.43 20.43 22.75 15 22.75Z" fill=""/>
    <path d="M8.50032 17.69C7.89032 17.69 7.33032 17.47 6.92032 17.07C6.43032 16.58 6.22032 15.87 6.33032 15.12L6.76032 12.11C6.84032 11.53 7.22032 10.78 7.63032 10.37L15.5103 2.49C17.5003 0.499998 19.5203 0.499998 21.5103 2.49C22.6003 3.58 23.0903 4.69 22.9903 5.8C22.9003 6.7 22.4203 7.58 21.5103 8.48L13.6303 16.36C13.2203 16.77 12.4703 17.15 11.8903 17.23L8.88032 17.66C8.75032 17.69 8.62032 17.69 8.50032 17.69ZM16.5703 3.55L8.69032 11.43C8.50032 11.62 8.28032 12.06 8.24032 12.32L7.81032 15.33C7.77032 15.62 7.83032 15.86 7.98032 16.01C8.13032 16.16 8.37032 16.22 8.66032 16.18L11.6703 15.75C11.9303 15.71 12.3803 15.49 12.5603 15.3L20.4403 7.42C21.0903 6.77 21.4303 6.19 21.4803 5.65C21.5403 5 21.2003 4.31 20.4403 3.54C18.8403 1.94 17.7403 2.39 16.5703 3.55Z" fill=""/>
    <path d="M19.8496 9.83003C19.7796 9.83003 19.7096 9.82003 19.6496 9.80003C17.0196 9.06003 14.9296 6.97003 14.1896 4.34003C14.0796 3.94003 14.3096 3.53003 14.7096 3.41003C15.1096 3.30003 15.5196 3.53003 15.6296 3.93003C16.2296 6.06003 17.9196 7.75003 20.0496 8.35003C20.4496 8.46003 20.6796 8.88003 20.5696 9.28003C20.4796 9.62003 20.1796 9.83003 19.8496 9.83003Z" fill=""/>
  </Icon>
);

export const DragHandler = ({
  title,
  width = 24,
  height = 24,
  viewBox = "0 0 24 24",
  ...props
}) => (
  <Icon title={title} width={width} height={height} viewBox={viewBox} {...props}>
    <path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" fill=""/>
    <rect x="9" y="7" width="2" height="2" rx="1" fill=""/>
    <rect x="13" y="7" width="2" height="2" rx="1" fill=""/>
    <rect x="9" y="11" width="2" height="2" rx="1" fill=""/>
    <rect x="13" y="11" width="2" height="2" rx="1" fill=""/>
    <rect x="9" y="15" width="2" height="2" rx="1" fill=""/>
    <rect x="13" y="15" width="2" height="2" rx="1" fill=""/>
  </Icon>
);
