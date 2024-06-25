interface IClickableIconProps {
  onClick: () => void
}

export const RiArrowRightSLine = ({ onClick }: IClickableIconProps) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    onClick={onClick}
    className='cursor-pointer text-white'
  >
    <path
      d='M9.57819 12.0535C10.2388 11.518 10.8266 11.0378 11.4179 10.5617C12.3864 9.78212 13.3694 9.02045 14.3206 8.21955C14.7172 7.8856 15.0509 7.47237 15.4071 7.08925C15.56 6.92477 15.6936 6.71307 15.5122 6.51482C15.3109 6.29463 15.0913 6.43326 14.9232 6.60451C13.1159 8.44754 10.8786 9.71207 8.89286 11.3153C8.30774 11.7878 8.2315 12.1857 8.72693 12.7703C8.88029 12.9577 9.0468 13.1333 9.22514 13.2959C10.5212 14.4362 11.8088 15.5874 13.1305 16.6959C13.5548 17.0517 14.0696 17.2968 14.5533 17.5737C14.6358 17.6209 14.8531 17.6018 14.8659 17.5633C14.9137 17.422 14.966 17.2153 14.8996 17.1128C14.6383 16.71 14.378 16.2866 14.0342 15.9637C13.2043 15.1844 12.3262 14.4593 11.4709 13.7084C10.9679 13.2667 10.4722 12.8162 9.97119 12.372C9.8616 12.275 9.74365 12.1874 9.57819 12.0535Z'
      fill='#FFFFFF'
    />
  </svg>
)

export const RiArrowLeftSLine = ({ onClick }: IClickableIconProps) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    onClick={onClick}
    className='cursor-pointer text-white'
  >
    <g id='Icons / Default icons/Arrow down'>
      <path
        d='M14.4218 12.0535C13.7612 11.518 13.1734 11.0378 12.5821 10.5617C11.6136 9.78212 10.6306 9.02045 9.67939 8.21955C9.28281 7.8856 8.94909 7.47237 8.59294 7.08925C8.43997 6.92477 8.30642 6.71307 8.4878 6.51482C8.68908 6.29463 8.90875 6.43326 9.07676 6.60451C10.8841 8.44754 13.1214 9.71207 15.1071 11.3153C15.6923 11.7878 15.7685 12.1857 15.2731 12.7703C15.1197 12.9577 14.9532 13.1333 14.7749 13.2959C13.4788 14.4362 12.1912 15.5874 10.8695 16.6959C10.4452 17.0517 9.9304 17.2968 9.44667 17.5737C9.36422 17.6209 9.14695 17.6018 9.13406 17.5633C9.0863 17.422 9.03401 17.2153 9.10038 17.1128C9.36167 16.71 9.622 16.2866 9.96581 15.9637C10.7957 15.1844 11.6738 14.4593 12.5291 13.7084C13.0321 13.2667 13.5278 12.8162 14.0288 12.372C14.1384 12.275 14.2563 12.1874 14.4218 12.0535Z'
        fill='#FFFFFF'
      />
    </g>
  </svg>
)

export const RiArrowDown = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g id='Icons / Default icons/Another icon'>
      <path
        id='another-icon-path'
        d='M11.9465 14.4199C12.482 13.7593 12.9622 13.1715 13.4383 12.5801C14.2179 11.6116 14.9795 10.6287 15.7805 9.67744C16.1144 9.28086 16.5276 8.94714 16.9107 8.59099C17.0752 8.43802 17.2869 8.30447 17.4852 8.48585C17.7054 8.68712 17.5667 8.90679 17.3955 9.0748C15.5525 10.8821 14.2879 13.1195 12.6847 15.1052C12.2122 15.6903 11.8143 15.7665 11.2297 15.2711C11.0423 15.1178 10.8667 14.9512 10.7041 14.7729C9.56382 13.4768 8.41257 12.1893 7.30414 10.8676C6.94825 10.4432 6.7032 9.92845 6.42626 9.44472C6.37912 9.36227 6.3982 9.145 6.43669 9.1321C6.57802 9.08435 6.78474 9.03205 6.88717 9.09843C7.29002 9.35971 7.71344 9.62005 8.0363 9.96386C8.81559 10.7937 9.54065 11.6719 10.2916 12.5271C10.7333 13.0302 11.1838 13.5259 11.628 14.0269C11.725 14.1364 11.8126 14.2544 11.9465 14.4199Z'
        fill='#8379BD'
      />
    </g>
  </svg>
)

export const UnreadMarker = () => (
  <svg width='21' height='16' viewBox='0 0 21 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='0.5' y='0.5' width='20' height='15' stroke='#47444F' />
  </svg>
)

export const MessageIcon = ({ count }: { count: number }) => (
  <svg width='25' height='23' viewBox='0 0 25 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M11.5245 17.7884C10.8599 17.7884 9.71942 17.7029 9.10035 17.7884C8.08086 18.5395 7.48276 19.1298 6.3732 19.7526C5.0515 20.4945 5.78981 19.956 4.50708 20.7572C3.92889 21.1184 2.04775 21.5114 2.04775 21.5114C3.1939 19.6047 2.28167 21.1788 3.1939 19.2156C3.2875 19.0142 3.74705 17.9828 3.6063 17.7884C3.40784 17.5143 1.52494 17.4085 1.01251 16.4691C0.335615 14.6738 0.858885 12.5785 0.893128 10.7242C0.910315 9.79354 1.08848 8.89842 1.08848 7.96574C1.08848 7.36303 1.2795 3.93512 1.45687 3.3667C1.93965 1.81948 1.86977 2.19959 3.1939 1.54923C4.06166 1.12302 5.92839 1.33335 6.97917 1.33335C7.76807 1.33335 8.08219 1.41134 8.47916 1.33335C9.20622 1.19051 10.0598 1.31477 10.7582 1.0575C11.0663 0.94403 11.5202 1.03351 11.8326 1.03351C12.5326 1.03351 13.2239 1.08072 13.9218 1.14146C14.4969 1.1915 15.0658 1.2494 15.6419 1.2494C17.2862 1.2494 20.3905 1.33335 20.3905 1.33335C20.3905 1.33335 23.2902 1.48901 23.4613 3.19118C23.4823 3.40002 23.4383 4.8107 23.4613 5.03934C23.4944 5.36862 23.5748 5.69751 23.6295 6.0228C23.7626 6.81328 23.4811 7.31635 23.6295 8.1001V10.4668C23.6295 11.053 23.4521 12.079 23.6295 12.8335C23.6295 13.6224 23.7714 14.069 23.5536 14.7061C23.32 15.3892 23.0594 16.2263 22.4303 16.5891C21.5322 17.1069 20.4263 17.7404 19.4029 17.7404H14.8577C14.0717 17.7404 12.3004 17.7884 11.5245 17.7884Z'
      fill='#DBF8CA'
      stroke='#47444F'
      stroke-linecap='round'
    />
    <text
      x='50%'
      y='50%'
      text-anchor='middle'
      alignment-baseline='middle'
      font-size='12'
      fill='#47444F'
    >
      {count}
    </text>
  </svg>
)

export const UpdateIcon = ({ count }: { count: number }) => (
  <svg width='26' height='22' viewBox='0 0 26 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='13.168' cy='11.5' r='10.5' fill='#DBF8CA' />
    <path
      d='M2.66797 8.5C3.12339 7.15939 4.66797 4.5 5.66797 3.5C7.63559 1.53237 10.469 1 13.2514 1C15.4173 1 18.0412 1.77176 19.6698 3.25563C20.5639 4.07025 21.9945 5.2848 22.2759 6.5274C22.3755 6.9673 22.4424 7.37296 22.6173 7.81154C22.7039 8.02874 23.7801 10.0438 23.6176 9.93743C23.4776 9.84586 22.7314 9.51144 22.5718 9.44184C21.7373 9.07795 21.5609 8.71904 20.668 8.5M23.266 9.24085C23.997 10.1512 23.6801 10.3459 24.0284 9.25202C24.244 8.57524 24.7216 7.57227 24.9838 7.2562'
      stroke='#47444F'
      stroke-linecap='round'
    />
    <path
      d='M23.168 14C22.719 15.8182 21.321 17.3636 20.1399 18.7065C18.6272 20.0909 15.668 21.5 13.168 21.5C8.92535 21.5 6.5047 19.6364 3.36185 16C2.91287 15.0909 2.51312 13.6909 2.22588 12.668C2.03453 11.9866 2.34177 11.3015 1.95286 12.2248C1.71236 12.7958 0.594487 16.629 0.671792 14.2635C0.70257 13.3217 1.3827 12.4361 1.42783 11.6265C1.47665 10.7508 1.69309 10.8834 2.07887 11.4713C2.53384 12.1648 3.64584 13.1733 4.452 13.222'
      stroke='#47444F'
      stroke-linecap='round'
    />
    <text
      x='50%'
      y='55%'
      text-anchor='middle'
      alignment-baseline='middle'
      font-size='12'
      fill='#47444F'
    >
      {count}
    </text>
  </svg>
)

export const Minus = ({ onClick }: IClickableIconProps) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='cursor-pointer'
    onClick={onClick}
  >
    <path
      d='M12.4298 11.0315C13.3692 11.0469 14.2913 11.0449 15.2123 11.0808C16.6825 11.1385 18.1517 11.2216 19.6213 11.2942C19.6747 11.2968 19.7277 11.3056 19.7813 11.308C20.0382 11.3204 20.2728 11.3791 20.318 11.6798C20.3518 11.905 20.1014 12.1345 19.7633 12.1415C18.9211 12.159 18.0787 12.1554 17.236 12.145C15.6978 12.1266 14.1596 12.0973 12.6215 12.0738C12.2308 12.0997 11.8405 12.041 11.4456 12.0481C10.5188 12.0649 9.61276 12.0626 8.70882 12.1031C7.84058 12.142 6.9745 12.2304 6.10712 12.2867C5.77439 12.3147 5.44009 12.3197 5.10656 12.3017C4.83145 12.2815 4.61886 12.1182 4.60871 11.8182C4.59855 11.5225 4.81792 11.3956 5.07143 11.3558C5.54481 11.269 6.02268 11.2083 6.50284 11.1739C8.01217 11.1054 9.52269 11.064 11.0328 11.0127C11.9329 10.9815 11.9984 11.0127 12.4298 11.0315Z'
      fill='#FFFFFF'
    />
  </svg>
)
export const Plus = ({ onClick }: IClickableIconProps) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='cursor-pointer'
    onClick={onClick}
  >
    <path
      d='M11.4429 11.0065C11.4714 9.60792 11.5056 8.24617 11.5245 6.88419C11.5356 6.09518 11.5155 5.30579 11.5245 4.51679C11.5243 4.30419 11.5597 4.09315 11.6293 3.89243C11.6653 3.79494 11.8358 3.67105 11.9218 3.68679C12.0359 3.70784 12.1503 3.83971 12.2205 3.95153C12.2718 4.03301 12.2597 4.15891 12.2628 4.26521C12.3175 6.28383 12.3711 8.30231 12.4236 10.3206C12.4295 10.547 12.4286 10.7736 12.4309 11.0295C13.3703 11.0449 14.2924 11.0429 15.2134 11.0788C16.6836 11.1365 18.1528 11.2197 19.6224 11.2922C19.6758 11.2948 19.7288 11.3036 19.7824 11.306C20.0393 11.3185 20.2739 11.3771 20.3191 11.6779C20.3529 11.9031 20.1025 12.1325 19.7643 12.1395C18.9222 12.157 18.0797 12.1534 17.2371 12.1431C15.6989 12.1247 14.1607 12.0953 12.6226 12.0719C12.5621 12.0759 12.502 12.084 12.4426 12.0963C12.4562 13.1999 12.4739 14.2954 12.4824 15.3912C12.4919 16.6618 12.4966 17.9325 12.4967 19.2031C12.4972 19.6802 12.3495 19.9246 12.0646 19.9515C11.7694 19.9793 11.5429 19.7399 11.5261 19.2408C11.4805 17.8913 11.4676 16.5408 11.4533 15.1902C11.4422 14.1612 11.4482 13.1318 11.4467 12.0462C10.5199 12.0629 9.61385 12.0607 8.70991 12.1012C7.84167 12.1401 6.9756 12.2284 6.10821 12.2848C5.77548 12.3128 5.44119 12.3178 5.10766 12.2998C4.83254 12.2795 4.61995 12.1162 4.60981 11.8162C4.59964 11.5205 4.81901 11.3936 5.07252 11.3538C5.5459 11.2671 6.02377 11.2063 6.50394 11.1719C8.01327 11.1034 9.52378 11.062 11.0339 11.0108C11.1532 11.0066 11.2731 11.0081 11.4429 11.0065Z'
      fill='#FFFFFF'
    />
  </svg>
)
export const DownloadIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <g clipPath='url(#clip0_2249_17820)'>
      <path
        d='M10.77 15.4119C10.6252 15.303 10.475 15.2016 10.32 15.1078L10.2867 15.0885C9.88959 14.8574 9.47908 14.6184 9.06375 14.4034C8.95701 14.3482 8.84966 14.287 8.7458 14.2277C8.4611 14.0653 8.16682 13.8975 7.82934 13.8169C7.81449 13.8133 7.79891 13.8141 7.78447 13.8191C7.77004 13.8241 7.75735 13.8331 7.74791 13.8451L7.58746 14.0476C7.57837 14.0591 7.57265 14.0729 7.57089 14.0875C7.56913 14.102 7.57142 14.1167 7.5775 14.13C7.58855 14.1542 7.59773 14.1789 7.60676 14.2028C7.62542 14.2628 7.65463 14.3189 7.69303 14.3686C8.56784 15.3851 9.63931 16.2939 11.1668 17.3156C11.2599 17.3747 11.3575 17.427 11.4585 17.4718C11.593 17.5391 11.741 17.5755 11.8916 17.5784C12.0937 17.5759 12.2882 17.5004 12.4388 17.3661C12.471 17.339 12.5039 17.3125 12.5367 17.286C12.6076 17.2292 12.6807 17.1703 12.748 17.1048C12.9335 16.9243 13.1199 16.7446 13.3071 16.5657C13.8034 16.0894 14.3165 15.5968 14.7966 15.0881C15.094 14.759 15.3704 14.4116 15.6243 14.0481C15.7091 13.9318 15.7938 13.8155 15.88 13.7008L15.8895 13.6881C15.9393 13.6231 16.0557 13.471 15.8841 13.2933C15.87 13.2787 15.8508 13.27 15.8305 13.2689C15.5401 13.2546 15.3466 13.424 15.1601 13.5889C15.0902 13.6537 15.016 13.7135 14.9377 13.7679C14.6453 13.9688 14.3662 14.1883 14.1023 14.425L14.0541 14.4664C13.9192 14.5822 13.7889 14.7063 13.663 14.8262C13.5426 14.9409 13.4181 15.0595 13.291 15.1693C13.2035 15.2448 13.1213 15.3286 13.0419 15.4095C12.8935 15.5748 12.7228 15.7187 12.5345 15.837C12.5334 15.8285 12.5324 15.8203 12.5314 15.812C12.5209 15.7451 12.5155 15.6775 12.5153 15.6099C12.5277 15.1753 12.5411 14.7407 12.5558 14.306C12.5783 13.6119 12.6016 12.8941 12.6169 12.1877C12.6217 11.9668 12.6267 11.7458 12.6319 11.5248C12.6777 9.54794 12.725 7.50456 12.5454 5.49597C12.481 4.77501 12.3718 4.0475 12.2663 3.34367L12.222 3.04744C12.195 2.93533 12.1456 2.82984 12.0765 2.73735C12.0343 2.66959 11.9865 2.59278 11.933 2.49479C11.9258 2.4816 11.9151 2.47072 11.9019 2.46337C11.8888 2.45602 11.8738 2.45246 11.8587 2.45323C11.8437 2.45399 11.8291 2.45898 11.8168 2.46761C11.8044 2.47625 11.7948 2.4882 11.789 2.50206C11.6068 2.93432 11.6009 3.3069 11.5956 3.63551C11.5939 3.75032 11.5921 3.85889 11.5836 3.96665C11.5689 4.15208 11.551 4.33728 11.5331 4.52233C11.5104 4.7559 11.487 4.99746 11.4708 5.23607C11.4474 5.57973 11.4328 5.92941 11.4188 6.26748C11.4142 6.37477 11.4097 6.48202 11.4051 6.58931L11.4001 6.70188C11.3821 7.1084 11.3636 7.52872 11.3499 7.94261C11.3374 8.32588 11.3278 8.73096 11.3198 9.21741C11.3147 9.5275 11.312 9.83803 11.3094 10.1485L11.3055 10.5713C11.3041 10.7119 11.3024 10.8526 11.3004 10.9932C11.2965 11.2987 11.2926 11.6147 11.2926 11.9257C11.293 12.3258 11.2955 12.7996 11.3103 13.2813C11.3164 13.4806 11.3281 13.6826 11.3396 13.8782C11.3525 14.0994 11.3658 14.3278 11.3707 14.5526C11.3738 14.6881 11.3849 14.8261 11.3956 14.9595C11.4283 15.245 11.43 15.5333 11.4007 15.8192C11.1798 15.7004 10.9689 15.5642 10.77 15.4119Z'
        fill='#FFFFFF'
      />
      <path
        d='M20.8122 12.3406C20.7586 12.311 20.6992 12.2932 20.638 12.2886C20.5768 12.284 20.5154 12.2927 20.4578 12.3139C20.4466 12.317 20.4362 12.3225 20.4273 12.33C20.4185 12.3375 20.4114 12.3469 20.4065 12.3574C20.1986 12.807 20.1408 15.2348 20.0986 17.0075C20.0821 17.7 20.0687 18.259 20.0504 18.5294C19.9529 18.5386 19.861 18.5484 19.7733 18.5577C19.5553 18.581 19.367 18.6008 19.1775 18.6053C18.4196 18.6234 17.5236 18.6417 16.6231 18.6417H16.6098C16.016 18.6417 15.422 18.6425 14.828 18.6441C12.9552 18.6474 11.0185 18.6513 9.11462 18.6169C7.99262 18.5966 6.85187 18.5247 5.74864 18.4551C5.28472 18.4258 4.80501 18.3957 4.33292 18.3699C4.2456 18.3631 4.15873 18.3514 4.07274 18.3348C4.0416 18.3295 4.00968 18.3241 3.97613 18.3188C3.96998 18.2777 3.96343 18.2372 3.95697 18.1971C3.93554 18.0784 3.9205 17.9585 3.9119 17.8382C3.89243 17.4656 3.87633 17.0928 3.86013 16.72C3.83195 16.0703 3.80283 15.3986 3.75597 14.7386C3.70614 14.0348 3.63514 12.8529 3.59738 12.2113C3.59091 12.0904 3.53864 11.9763 3.45109 11.8922C3.36356 11.8081 3.24725 11.7601 3.1256 11.7579C3.0007 11.7553 2.87959 11.8006 2.78742 11.8846C2.69525 11.9686 2.6391 12.0847 2.63062 12.2088C2.55378 13.4036 2.38414 16.3627 2.46806 18.0312L2.47344 18.146C2.47624 18.4035 2.50577 18.6602 2.56157 18.9117C2.67718 19.3569 2.9446 19.5566 3.45554 19.5794C3.86107 19.5977 4.26652 19.6191 4.67189 19.6406C5.31805 19.6748 5.98671 19.7104 6.64502 19.7312C8.08846 19.7777 9.39542 19.8042 10.6406 19.8132C11.1956 19.8172 11.7505 19.8223 12.3055 19.8286C13.3004 19.8389 14.3096 19.8494 15.3242 19.8494C16.6913 19.8494 18.0681 19.8304 19.4318 19.7665C19.7275 19.7582 20.0224 19.7308 20.3146 19.6843C20.7798 19.6016 21.0412 19.3159 21.0702 18.8579C21.0815 18.6793 21.0961 18.4863 21.111 18.2913C21.1311 18.0268 21.152 17.7534 21.1649 17.5034C21.1555 15.7706 20.9816 12.8062 20.9482 12.5736C20.9439 12.5273 20.9295 12.4824 20.906 12.4422C20.8825 12.402 20.8505 12.3672 20.8122 12.3406Z'
        fill='#FFFFFF'
      />
    </g>
    <defs>
      <clipPath id='clip0_2249_17820'>
        <rect width='18.84' height='17.52' fill='white' transform='translate(2.39844 2.39844)' />
      </clipPath>
    </defs>
  </svg>
)

export const DownArrow = () => (
  <svg width='6' height='21' viewBox='0 0 6 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M3 20.0439L0.113249 15.0439L5.88675 15.0439L3 20.0439ZM3.5 0.0439453L3.5 15.5439H2.5L2.5 0.0439453L3.5 0.0439453Z'
      fill='#25222C'
    />
  </svg>
)
export const RightArrow = () => (
  <svg width='41' height='7' viewBox='0 0 41 7' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      id='Arrow 4'
      d='M40.5 3.5L35.5 6.38675V0.613249L40.5 3.5ZM0.5 3L36 3V4L0.5 4L0.5 3Z'
      fill='#25222C'
    />
  </svg>
)

export const Hamburger = () => (
  <svg width='30' height='23' viewBox='0 0 30 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <line x1='0.5' y1='1' x2='29.5' y2='1' stroke='black' />
    <line x1='0.5' y1='8' x2='29.5' y2='8' stroke='black' />
    <line x1='0.5' y1='15' x2='29.5' y2='15' stroke='black' />
    <line x1='0.5' y1='22' x2='29.5' y2='22' stroke='black' />
  </svg>
)