FROM glados:tf

# Setup env
ENV NODE_VERSION=8.6.0 NPM_VERSION=5

# Install node & npm
RUN echo "Collecting dependencies..." && \
  apt-get update -y && \
  apt-get install build-essential && \
  gpg --keyserver ha.pool.sks-keyservers.net --recv-keys \
    94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
    FD3A5288F042B6850C66B31F09FE44734EB7990E \
    71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
    DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
    C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
    B9AE9905FFD7803F25714661B63B535A4C206CA9 \
    56730D5401028683275BD23C23EFEFE93C4CFFFE && \
  curl -sSLO https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}.tar.xz && \
  curl -sSL https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt.asc | gpg --batch --decrypt | \
    grep " node-v${NODE_VERSION}.tar.xz\$" | sha256sum -c | grep . && \
  \
  echo "Extracting node ${NODE_VERSION}..." && \
  \
  tar -xvf node-v${NODE_VERSION}.tar.xz && \
  cd node-v${NODE_VERSION} && \
  ./configure --prefix=/usr ${NODE_CONFIG_FLAGS} && \
  \
  echo "Building node ${NODE_VERSION}..." && \
  \
  make -j$(getconf _NPROCESSORS_ONLN) && \
  make install && \
  cd / && \
  if [ -z "$NODE_CONFIG_FLAGS" ]; then \
    npm install -g npm@${NPM_VERSION} && \
    find /usr/lib/node_modules/npm -name test -o -name .bin -type d | xargs rm -rf && \
    if [ -n "$YARN_VERSION" ]; then \
      gpg --keyserver ha.pool.sks-keyservers.net --recv-keys \
        6A010C5166006599AA17F08146C2130DFD2497F5 && \
      curl -sSL -O https://yarnpkg.com/${YARN_VERSION}.tar.gz -O https://yarnpkg.com/${YARN_VERSION}.tar.gz.asc && \
      gpg --batch --verify ${YARN_VERSION}.tar.gz.asc ${YARN_VERSION}.tar.gz && \
      mkdir /usr/local/share/yarn && \
      tar -xf ${YARN_VERSION}.tar.gz -C /usr/local/share/yarn --strip 1 && \
      ln -s /usr/local/share/yarn/bin/yarn /usr/local/bin/ && \
      ln -s /usr/local/share/yarn/bin/yarnpkg /usr/local/bin/ && \
      rm ${YARN_VERSION}.tar.gz*; \
    fi; \
  fi && \
  \
  echo "Cleaning up..." && \
  \
  rm -rf /node-v${NODE_VERSION}* /usr/share/man /tmp/* \
    /root/.npm /root/.node-gyp /root/.gnupg /usr/lib/node_modules/npm/man \
    /usr/lib/node_modules/npm/doc /usr/lib/node_modules/npm/html /usr/lib/node_modules/npm/scripts && \
  echo "Version info - node=$(node -v), npm=$(npm -v)"


# Workdir
WORKDIR /opt

# Install extra dependencies
COPY ./requirements.txt /opt
RUN pip install -r requirements.txt

# Add packages
COPY ./entry.sh /opt/entry.sh
COPY ./pkg.tar.gz /opt/pkg.tar.gz
COPY ./cnn.tar.gz /opt/cnn.tar.gz

# Unpack
RUN tar -zxvf /opt/cnn.tar.gz && \
    tar -zxvf /opt/pkg.tar.gz && \
    cd /opt/server && \
    npm i && \
    chmod a+x /opt/*

# Expose ports
EXPOSE 3000-8080

# Entrypoint
CMD ["/bin/bash", "/opt/entry.sh"]
