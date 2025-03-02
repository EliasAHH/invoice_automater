namespace :frontend do
  desc 'Build frontend assets'
  task :build do
    Dir.chdir('frontend') do
      system 'npm install'
      system 'npm run build'
    end
  end
end 