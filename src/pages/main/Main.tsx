import React from 'react';
import Link from 'next/link';

import { RoutePaths } from '@/types/index'
import { Layout } from '@/components/Layout';

export default function Main () {
  return (
    <Layout>
      <div className='description'>
        <p>
          Molestie ultricies. Sed sapien id nisi venenatis lorem non molestie venenatis platea ornare tempus non
          integer sit amet, ut. Sit pellentesque augue amet vestibulum eget urna vulputate lectus sit tempus justo
          venenatis molestie arcu quis, ut. Et. Nec malesuada consectetur quam, faucibus. Non molestie non sit ornare
          eleifend tempus faucibus. Nulla tempus cursus sapien lacinia id non accumsan dolor ex. Nec amet, sit luctus
          et sit cras imperdiet amet tortor, faucibus. Faucibus. Ultricies. In cursus ultricies. Vulputate nisi morbi
          urna integer integer dictum. Elit. Nisi venenatis et risus est. Nisi molestie pellentesque mattis cras
          imperdiet non elit. Habitasse integer vulputate eget accumsan lacinia lorem tortor, nisi mattis nisi nisi
          mollis sed luctus ut. Non justo vulputate morbi orci, luctus malesuada mauris dictum. Morbi eleifend
          pulvinar in ex. Amet, faucibus. In sit velit pulvinar quam, in mollis leo, ipsum molestie tempus ut. Nunc
          urna eget molestie venenatis mauris dui venenatis non tortor, amet tempus dui sit ornare eget malesuada
          faucibus. Dictum lorem ornare vulputate in molestie sodales dictum. Mauris nulla ultricies. Odio. Mauris non
          dui mattis mattis id lacinia sit malesuada aenean.
        </p>
        <Link href={RoutePaths.Game}>Game</Link>
      </div>
    </Layout>
  )
}
