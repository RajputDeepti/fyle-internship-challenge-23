import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  }); 

  it('should get user repositories', () => {
    const mockUsername = 'testUser';
    const mockPage = 1;
    const mockPerPage = 10;

    const mockResponse = [{ }];

    service.getUserRepos(mockUsername, mockPage, mockPerPage).subscribe(response => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users/${mockUsername}/repos?page=${mockPage}&per_page=${mockPerPage}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should handle no response headers for total pages', () => {
    const mockLinkHeader = null;
    const result = service.parseLinkHeaderForTotalPages(mockLinkHeader);
    expect(result).toBe(0);
  });

  it('should handle empty response headers for total pages', () => {
    const mockLinkHeader = '';
    const result = service.parseLinkHeaderForTotalPages(mockLinkHeader);
    expect(result).toBe(0);
  });

  it('should handle response headers with no "last" link for total pages', () => {
    const mockLinkHeader = '<https://api.github.com/repositories/1?page=1&per_page=10>; rel="first"';
    const result = service.parseLinkHeaderForTotalPages(mockLinkHeader);
    expect(result).toBe(0);
  });

  it('should handle response headers with "last" link for total pages', () => {
    const mockLinkHeader = '<https://api.github.com/repositories/1?page=1&per_page=10>; rel="first", <https://api.github.com/repositories/1?page=2&per_page=10>; rel="last"';
    const result = service.parseLinkHeaderForTotalPages(mockLinkHeader);
    expect(result).toBe(2);
  });

  it('should get user profile photo', () => {
    const mockUsername = 'testUser';
    const mockResponse = 'https://example.com/avatar.jpg';

    service.getUserProfilePhoto(mockUsername).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users/${mockUsername}`);
    expect(req.request.method).toBe('GET');

    req.flush({ avatar_url: mockResponse });
  });
});
