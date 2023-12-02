import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GithubReposComponent } from './github-repos.component';
import { ApiService } from '../services/api.service';
import { of } from 'rxjs';

describe('GithubReposComponent', () => {
  let component: GithubReposComponent;
  let fixture: ComponentFixture<GithubReposComponent>;
  let apiService: ApiService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GithubReposComponent],
        imports: [HttpClientTestingModule],
        providers: [ApiService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubReposComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.username).toEqual('');
    expect(component.profilePhotoUrl).toEqual('');
    expect(component.repositories).toEqual([]);
    expect(component.loading).toBeFalse();
    expect(component.page).toEqual(1);
    expect(component.perPage).toEqual(10);
    expect(component.totalPages).toEqual(0);
  });

  it('should load repositories on initialization', () => {
    const getUserReposSpy = spyOn(apiService, 'getUserRepos').and.returnValue(
      of({
        body: [{ name: 'repo1' }, { name: 'repo2' }],
        totalPages: 2,
      })
    );

    component.ngOnInit();

    expect(component.loading).toBeTrue();
    expect(getUserReposSpy).toHaveBeenCalledWith('', 1, 10);

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.repositories.length).toEqual(2);
    expect(component.totalPages).toEqual(2);
  });

  it('should load repositories for a specific username', () => {
    const getUserReposSpy = spyOn(apiService, 'getUserRepos').and.returnValue(
      of({
        body: [{ name: 'repo3' }, { name: 'repo4' }],
        totalPages: 2,
      })
    );

    component.loadRepositories('testuser');

    expect(component.loading).toBeTrue();
    expect(getUserReposSpy).toHaveBeenCalledWith('testuser', 1, 10);

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.repositories.length).toEqual(2);
    expect(component.totalPages).toEqual(2);
  });

  it('should set page and load repositories for that page', () => {
    const getUserReposSpy = spyOn(apiService, 'getUserRepos').and.returnValue(
      of({
        body: [{ name: 'repo5' }, { name: 'repo6' }],
        totalPages: 3,
      })
    );

    component.setPage(2);

    expect(component.page).toEqual(2);
    expect(component.loading).toBeTrue();
    expect(getUserReposSpy).toHaveBeenCalledWith('', 2, 10);

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.repositories.length).toEqual(2);
    expect(component.totalPages).toEqual(3);
  });
});

