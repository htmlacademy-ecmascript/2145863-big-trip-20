
import Service from './service.js';

class ApiService extends Service {
  /**
   * @param {Partial<ServiceOptions>} options
   */
  constructor(options) {
    super({
      baseUrl: 'https://20.ecmascript.pages.academy/big-trip/',
      minResponseTime: 500,
      authorization: '',
      // options - для возможности расширения
      ...options,
    });
  }

  /**
   * @returns {Promise<Array<PointInSnakeCase>>}
   */
  async getPoints() {
    const response = await this.request('points');
    return response.json();
  }

  /**
   * @param {PointInSnakeCase} point
   * @returns {Promise<PointInSnakeCase>}
   */
  async addPoint(point) {
    const response = await this.request('points', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(point),
    });

    return response.json();
  }

  /**
   * @param {PointInSnakeCase} point
   * @returns {Promise<PointInSnakeCase>}
   */
  async updatePoint(point) {
    const response = await this.request(`points/${point.id}`, {
      method: 'PUT',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(point),
    });

    return response.json();
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deletePoint(id) {
    await this.request(`points/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * @returns {Promise<Array<Destination>>}
   */
  async getDestinations() {
    const response = await this.request('destinations');
    return response.json();
  }

  /**
   * @returns {Promise<Array<OfferGroup>>}
  */
  async getOfferGroups() {
    const response = await this.request('offers');
    return response.json();
  }
}

export default ApiService;
